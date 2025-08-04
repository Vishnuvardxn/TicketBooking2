import React from 'react'

const ShowtimeReportPrint = ({ showtime }) => {
	const row = showtime?.theater?.seatPlan?.row
	let rowLetters = []
	if (row) {
		for (let k = 64; k <= (row.length === 2 ? row.charCodeAt(0) : 64); k++) {
			for (
				let i = 65;
				i <= (k === row.charCodeAt(0) || row.length === 1 ? row.charCodeAt(row.length - 1) : 90);
				i++
			) {
				const letter = k === 64 ? String.fromCharCode(i) : String.fromCharCode(k) + String.fromCharCode(i)
				rowLetters.push(letter)
			}
		}
	}
	rowLetters.reverse()

	const column = showtime?.theater?.seatPlan.column
	let colNumber = []
	for (let k = 1; k <= column; k++) {
		colNumber.push(k)
	}

	const today = new Date()
	const formattedDate = today.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
	const formattedTime = today.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	})

	const showtimeDate = new Date(showtime.showtime)
	const showtimeFormattedDate = showtimeDate.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
	const showtimeFormattedTime = showtimeDate.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	})

	return (
		<div className="hidden p-8 print:block">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold">Showtime Booking Report</h1>
				<p className="text-lg">
					Generated on: {formattedDate} at {formattedTime}
				</p>
			</div>

			<div className="mb-8 text-center break-after-page">
				<h2 className="text-2xl font-bold">{showtime.movie.name}</h2>
				<p className="text-xl">
					{showtime.theater.cinema.name} - Theater {showtime.theater.number}
				</p>
				<p className="text-lg">
					{showtimeFormattedDate} at {showtimeFormattedTime}
				</p>

				<div className="mt-8">
					<h2 className="mb-4 text-xl font-bold text-center">Seat Booking Status</h2>
					<div className="flex flex-col items-center">
						<div className="p-2 w-full text-center font-bold bg-gray-300 rounded-md">SCREEN</div>
						<div className="my-4">
							{rowLetters.map((rowLetter) => (
								<div key={rowLetter} className="flex">
									{colNumber.map((col) => {
										const isBooked = showtime.seats.some(
											(seat) => seat.row === rowLetter && seat.number === col
										)
										return (
											<div
												key={`${rowLetter}${col}`}
												className={`m-1 h-10 w-10 flex items-center justify-center border-2 rounded-md ${
													isBooked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
												}`}
											>
												<span className="text-sm">{`${rowLetter}${col}`}</span>
											</div>
										)
									})}
								</div>
							))}
						</div>
						<div className="mt-4 flex justify-center gap-4">
							<div className="flex items-center gap-2">
								<div className="h-4 w-4 bg-green-500 border rounded-sm"></div>
								<span>Available</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-4 w-4 bg-red-500 border rounded-sm"></div>
								<span>Booked</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h2 className="mb-4 text-xl font-bold text-center">Booking Records</h2>
				<table className="w-full border-collapse text-left">
					<thead>
						<tr>
							<th className="border-b-2 border-gray-400 p-2">Seat</th>
							<th className="border-b-2 border-gray-400 p-2">Username</th>
							<th className="border-b-2 border-gray-400 p-2">Email</th>
						</tr>
					</thead>
					<tbody>
						{showtime.seats
							.sort((a, b) => {
								const rowA = a.row
								const numberA = a.number
								const rowB = b.row
								const numberB = b.number
								if (rowA === rowB) {
									return numberA - numberB
								}
								if (rowA.length !== rowB.length) {
									return rowA.length - rowB.length
								}
								return rowA.localeCompare(rowB)
							})
							.map((seat) => (
								<tr key={`${seat.row}${seat.number}`}>
									<td className="border-b border-gray-300 p-2">{`${seat.row}${seat.number}`}</td>
									<td className="border-b border-gray-300 p-2">{seat.user.username}</td>
									<td className="border-b border-gray-300 p-2">{seat.user.email}</td>
								</tr>
							))}
					</tbody>
				</table>
				<div className="mt-2 text-right">
					<p className="font-bold">Total Booked Seats: {showtime.seats.length}</p>
				</div>
			</div>

			<div className="mt-8 text-center text-sm text-gray-500">
				<p>*** End of Report ***</p>
			</div>
		</div>
	)
}

export default ShowtimeReportPrint 