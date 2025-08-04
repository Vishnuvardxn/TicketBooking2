import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import MovieCard from '../components/MovieCard'

const AllMovies = () => {
	const [movies, setMovies] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true)
			try {
				const response = await axios.get('/movie')
				setMovies(response.data.data)
			} catch (error) {
				console.error('Error fetching movies:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchMovies()
	}, [])

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">All Movies</h2>
				{isLoading ? (
					<Loading />
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
						{movies.map((movie) => (
							<MovieCard key={movie._id} movie={movie} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default AllMovies 