import { EyeSlashIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Showtimes = ({ showtimes, movies, selectedDate, filterMovie, showMovieDetail = true }) => {
	const { auth } = useContext(AuthContext)
	const navigate = useNavigate()

	const isPast = (date) => {
		return date < new Date()
	}

	const filteredShowtimes = showtimes?.filter(
		(showtime) =>
			new Date(showtime.showtime).getDate() === selectedDate.getDate() &&
			new Date(showtime.showtime).getMonth() === selectedDate.getMonth() &&
			new Date(showtime.showtime).getFullYear() === selectedDate.getFullYear()
	)

	if (!filteredShowtimes || filteredShowtimes.length === 0) {
		return <p className="text-center">There are no showtimes available for this date.</p>
	}

	if (!showMovieDetail) {
		return (
			<div className="flex flex-wrap gap-4 pt-4">
				{filteredShowtimes.map((showtime) => {
					const movie = movies.find((m) => m._id === showtime.movie) || movies[0]
					const cinemaName = showtime.theater?.cinema?.name || 'Unknown Cinema'
					const theaterNumber = showtime.theater?.number || 'Unknown Theater'

					return (
						<button
							key={showtime._id}
							title={`${new Date(showtime.showtime)
								.getHours()
								.toString()
								.padStart(2, '0')} : ${new Date(showtime.showtime)
								.getMinutes()
								.toString()
								.padStart(2, '0')} - ${new Date(
								new Date(showtime.showtime).getTime() + movie.length * 60000
							)
								.getHours()
								.toString()
								.padStart(2, '0')} : ${new Date(
								new Date(showtime.showtime).getTime() + movie.length * 60000
							)
								.getMinutes()
								.toString()
								.padStart(2, '0')}`}
							className={
								isPast(new Date(showtime.showtime))
									? `flex flex-col items-center justify-center gap-1 rounded-md bg-gradient-to-br from-gray-100 to-white px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-800 drop-shadow-sm ${
											auth.role !== 'admin' && 'cursor-not-allowed'
									  } ${auth.role === 'admin' && 'to-gray-100 hover:from-gray-200'}`
									: 'flex flex-col items-center justify-center gap-1 rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 px-3 py-2 text-white drop-shadow-sm hover:from-indigo-500 hover:to-blue-400'
							}
							onClick={() => {
								if (!isPast(new Date(showtime.showtime)) || auth.role === 'admin')
									return navigate(`/showtime/${showtime._id}`)
							}}
						>
							<p className="text-lg font-bold">{cinemaName}</p>
							<p className="font-semibold">Theater {theaterNumber}</p>
							<div className="flex items-center gap-1">
								{!showtime.isRelease && <EyeSlashIcon className="h-6 w-6" title="Unreleased showtime" />}
								<p className="text-lg">
									{`${new Date(showtime.showtime).getHours().toString().padStart(2, '0')} : ${new Date(
										showtime.showtime
									)
										.getMinutes()
										.toString()
										.padStart(2, '0')}`}
								</p>
							</div>
						</button>
					)
				})}
			</div>
		)
	}

	const renderShowtimeButton = (showtime) => {
		const movie = movies.find((m) => m._id === showtime.movie) || movies[0]
		return (
			<button
				key={showtime._id}
				title={`${new Date(showtime.showtime).getHours().toString().padStart(2, '0')} : ${new Date(showtime.showtime)
					.getMinutes()
					.toString()
					.padStart(2, '0')} - ${new Date(new Date(showtime.showtime).getTime() + movie.length * 60000)
					.getHours()
					.toString()
					.padStart(2, '0')} : ${new Date(new Date(showtime.showtime).getTime() + movie.length * 60000)
					.getMinutes()
					.toString()
					.padStart(2, '0')}`}
				className={
					isPast(new Date(showtime.showtime))
						? `flex items-center gap-1 rounded-md bg-gradient-to-br from-gray-100 to-white px-2 py-1 text-lg text-gray-900 ring-1 ring-inset ring-gray-800 drop-shadow-sm ${
								auth.role !== 'admin' && 'cursor-not-allowed'
						  } ${auth.role === 'admin' && 'to-gray-100 hover:from-gray-200'}`
						: 'flex items-center gap-1 rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-lg text-white drop-shadow-sm hover:from-indigo-500 hover:to-blue-400'
				}
				onClick={() => {
					if (!isPast(new Date(showtime.showtime)) || auth.role === 'admin')
						return navigate(`/showtime/${showtime._id}`)
				}}
			>
				{!showtime.isRelease && <EyeSlashIcon className="h-6 w-6" title="Unreleased showtime" />}
				{`${new Date(showtime.showtime).getHours().toString().padStart(2, '0')} : ${new Date(showtime.showtime)
					.getMinutes()
					.toString()
					.padStart(2, '0')}`}
			</button>
		)
	}

	// Original rendering logic for other pages
	const sortedShowtimes = filteredShowtimes.reduce((result, showtime) => {
		const { movie } = showtime
		if (filterMovie && filterMovie._id !== movie) {
			return result // skip
		}
		if (!result[movie]) {
			result[movie] = []
		}
		result[movie].push(showtime)
		return result
	}, {})

	return (
		<>
			{movies?.map((movie) => {
				return (
					sortedShowtimes &&
					sortedShowtimes[movie._id] && (
						<div key={movie._id} className="flex items-center">
							{showMovieDetail && <img src={movie.img} className="w-32 px-4 drop-shadow-md" />}
							<div className="mr-4 flex flex-col gap-2 pb-4 pt-2">
								{showMovieDetail && (
									<div>
										<h4 className="text-2xl font-semibold">{movie.name}</h4>
										<p className="text-md font-medium">length : {movie.length || '-'} min</p>
									</div>
								)}
								<div className="flex flex-wrap items-center gap-2 pt-1">
									{sortedShowtimes[movie._id]?.map(renderShowtimeButton)}
								</div>
							</div>
						</div>
					)
				)
			})}
		</>
	)
}

export default Showtimes
