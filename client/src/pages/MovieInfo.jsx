import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import Showtimes from '../components/Showtimes'
import DateSelector from '../components/DateSelector'

const MovieInfo = () => {
	const { id } = useParams()
	const [movie, setMovie] = useState(null)
	const [showtimes, setShowtimes] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedDate, setSelectedDate] = useState(new Date())

	useEffect(() => {
		const fetchMovie = async () => {
			setIsLoading(true)
			try {
				const movieResponse = await axios.get(`/movie/${id}`)
				setMovie(movieResponse.data.data)

				const showtimesResponse = await axios.get(`/showtime/movie/${id}`)
				setShowtimes(showtimesResponse.data.data)
			} catch (error) {
				console.error('Error fetching movie data:', error)
			} finally {
				setIsLoading(false)
			}
		}
		if (id) {
			fetchMovie()
		}
	}, [id])

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				{isLoading ? (
					<Loading />
				) : movie ? (
					<>
						<div className="flex flex-col gap-4 md:flex-row">
							<div className="w-full md:w-1/5">
								<img src={movie.img} alt={movie.name} className="w-full rounded-lg shadow-lg" />
							</div>
							<div className="w-full md:w-4/5">
								<h2 className="text-2xl font-bold text-gray-900">{movie.name}</h2>
								<p className="mt-2 text-md">
									<strong>Plot:</strong> {movie.plot}
								</p>
								<div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
									<p>
										<strong>Genre:</strong> {movie.genre}
									</p>
									<p>
										<strong>Rated:</strong> {movie.rated}
									</p>
									<p>
										<strong>Released:</strong> {new Date(movie.released).toLocaleDateString()}
									</p>
									<p>
										<strong>Runtime:</strong> {movie.length} min
									</p>
									<p>
										<strong>Director:</strong> {movie.director}
									</p>
									<p>
										<strong>Writer:</strong> {movie.writer}
									</p>
									<p className="sm:col-span-2 lg:col-span-3">
										<strong>Actors:</strong> {movie.actors}
									</p>
									<p>
										<strong>Language:</strong> {movie.language}
									</p>
									<p>
										<strong>Country:</strong> {movie.country}
									</p>
									<p className="lg:col-span-2">
										<strong>Awards:</strong> {movie.awards}
									</p>
									<p>
										<strong>IMDb Rating:</strong> {movie.imdbRating}
									</p>
									<p>
										<strong>Box Office:</strong> {movie.boxOffice}
									</p>
									{movie.ratings &&
										movie.ratings.map((rating) => (
											<p key={rating.Source}>
												<strong>{rating.Source}:</strong> {rating.Value}
											</p>
										))}
								</div>
							</div>
						</div>
						<div className="mt-4">
							<h3 className="text-2xl font-bold text-gray-900">Showtimes</h3>
							<DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
							<Showtimes
								showtimes={showtimes}
								movies={[movie]}
								selectedDate={selectedDate}
								showMovieDetail={false}
							/>
						</div>
					</>
				) : (
					<p>Movie not found.</p>
				)}
			</div>
		</div>
	)
}

export default MovieInfo 