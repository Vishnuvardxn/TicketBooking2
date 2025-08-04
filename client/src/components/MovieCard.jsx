import { Link } from 'react-router-dom'

const MovieCard = ({ movie }) => {
	return (
		<Link to={`/movies/${movie._id}`}>
			<div className="transform overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 hover:scale-105">
				<img
					src={movie.img}
					alt={movie.name}
					className="w-full object-cover"
					style={{ height: '210px' }}
				/>
				<div className="p-4">
					<h3 className="truncate text-lg font-bold">{movie.name}</h3>
					<p className="truncate text-sm text-gray-600">{movie.genre}</p>
					<p className="text-sm text-gray-600">{movie.year}</p>
				</div>
			</div>
		</Link>
	)
}

export default MovieCard 