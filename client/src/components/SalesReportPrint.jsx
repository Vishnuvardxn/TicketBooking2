import React from 'react'

const SalesReportPrint = ({ showtimes, filters }) => {
	const totalRevenue = showtimes.reduce((acc, showtime) => {
		return acc + showtime.seats.length * showtime.price
	}, 0)

	const groupedShowtimes = showtimes.reduce((acc, showtime) => {
		const cinemaName = showtime.theater.cinema.name
		const theaterNumber = showtime.theater.number

		if (!acc[cinemaName]) {
			acc[cinemaName] = {}
		}
		if (!acc[cinemaName][theaterNumber]) {
			acc[cinemaName][theaterNumber] = {
				showtimes: [],
				subtotal: 0
			}
		}
		acc[cinemaName][theaterNumber].showtimes.push(showtime)
		acc[cinemaName][theaterNumber].subtotal += showtime.seats.length * showtime.price

		return acc
	}, {})

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

	const renderFilter = (label, value) => {
		if (!value) return null

		let displayValue
		if (Array.isArray(value)) {
			if (value.length === 0) return null
			displayValue = value.map((v) => v.label).join(', ')
		} else if (typeof value === 'object' && value.label) {
			displayValue = value.label
		} else if (typeof value === 'boolean' && value) {
			displayValue = 'Yes'
		} else if (typeof value === 'boolean' && !value) {
			return null
		} else {
			return null
		}

		return (
			<div>
				<span className="font-semibold">{label}: </span>
				<span>{displayValue}</span>
			</div>
		)
	}

	const hasActiveFilters =
		filters &&
		Object.values(filters).some((value) => {
			if (Array.isArray(value)) return value.length > 0
			if (typeof value === 'object' && value !== null) return true
			return !!value
		})

	return (
		<div className="hidden p-8 print:block">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold">Sales Report</h1>
				<p className="text-lg">
					Generated on: {formattedDate} at {formattedTime}
				</p>
				<p className="text-md">({showtimes.length} showtimes)</p>
			</div>
			{hasActiveFilters && (
				<div className="mb-8">
					<h2 className="mb-2 text-xl font-bold">Filters Applied</h2>
					<div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
						{renderFilter('Cinema', filters.cinema)}
						{renderFilter('Theater', filters.theater)}
						{renderFilter('Movie', filters.movie)}
						{renderFilter('Date', filters.date)}
						{renderFilter('Date From', filters.dateFrom)}
						{renderFilter('Date To', filters.dateTo)}
						{renderFilter('Past Dates', filters.isPastDate)}
						{renderFilter('Today', filters.isToday)}
						{renderFilter('Future Dates', filters.isFutureDate)}
						{renderFilter('Time', filters.time)}
						{renderFilter('Time From', filters.timeFrom)}
						{renderFilter('Time To', filters.timeTo)}
						{renderFilter('Released', filters.isReleased)}
						{renderFilter('Unreleased', filters.isUnreleased)}
					</div>
				</div>
			)}

			{Object.entries(groupedShowtimes).map(([cinemaName, theaters]) => (
				<div key={cinemaName} className="mb-8 break-inside-avoid">
					<h2 className="mb-2 text-2xl font-bold">{cinemaName}</h2>
					{Object.entries(theaters).map(([theaterNumber, data]) => (
						<div key={theaterNumber} className="mb-6 break-inside-avoid">
							<h3 className="mb-1 text-xl font-semibold">Theater {theaterNumber}</h3>
							<table className="w-full border-collapse text-left">
								<thead>
									<tr>
										<th className="border-b-2 border-gray-400 p-2">Movie</th>
										<th className="border-b-2 border-gray-400 p-2">Date & Time</th>
										<th className="border-b-2 border-gray-400 p-2 text-right">Booked Seats</th>
										<th className="border-b-2 border-gray-400 p-2 text-right">Price/Ticket</th>
										<th className="border-b-2 border-gray-400 p-2 text-right">Revenue</th>
									</tr>
								</thead>
								<tbody>
									{data.showtimes
										.sort((a, b) => new Date(a.showtime) - new Date(b.showtime))
										.map((showtime) => {
											const showtimeRevenue = showtime.seats.length * showtime.price
											const showtimeDate = new Date(showtime.showtime)
											const year = showtimeDate.getFullYear()
											const month = showtimeDate.toLocaleString('default', { month: 'short' })
											const day = showtimeDate.getDate().toString().padStart(2, '0')
											const hours = showtimeDate.getHours().toString().padStart(2, '0')
											const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
											const formattedShowtime = `${day} ${month} ${year}, ${hours}:${minutes}`

											return (
												<tr key={showtime._id}>
													<td className="border-b border-gray-300 p-2">{showtime.movie.name}</td>
													<td className="border-b border-gray-300 p-2">{formattedShowtime}</td>
													<td className="border-b border-gray-300 p-2 text-right">
														{showtime.seats.length}
													</td>
													<td className="border-b border-gray-300 p-2 text-right">
														${showtime.price.toFixed(2)}
													</td>
													<td className="border-b border-gray-300 p-2 text-right">
														${showtimeRevenue.toFixed(2)}
													</td>
												</tr>
											)
										})}
								</tbody>
								<tfoot>
									<tr>
										<td colSpan="4" className="border-t-2 border-gray-400 p-2 text-right font-bold">
											Subtotal:
										</td>
										<td className="border-t-2 border-gray-400 p-2 text-right font-bold">
											${data.subtotal.toFixed(2)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					))}
				</div>
			))}
			<table className="w-full">
				<tfoot>
					<tr>
						<td
							colSpan="4"
							className="border-t-4 border-double border-gray-800 p-2 text-right text-lg font-bold"
						>
							Grand Total:
						</td>
						<td
							colSpan="1"
							className="border-t-4 border-double border-gray-800 p-2 text-right text-lg font-bold"
						>
							${totalRevenue.toFixed(2)}
						</td>
					</tr>
				</tfoot>
			</table>

			<div className="mt-8 text-center text-sm text-gray-500">
				<p>*** End of Report ***</p>
			</div>
		</div>
	)
}

export default SalesReportPrint 