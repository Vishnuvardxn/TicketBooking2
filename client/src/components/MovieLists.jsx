import { TrashIcon } from '@heroicons/react/24/solid'

const MovieLists = ({ movies, search, handleDelete }) => {
	const moviesList = movies?.filter((movie) => movie.name.toLowerCase().includes(search?.toLowerCase() || ''))

	return !!moviesList.length ? (
		<div className="grid grid-cols-1 gap-4 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 drop-shadow-md lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-5">
			{moviesList.map((movie, index) => {
				return (
					<div key={index} className="flex min-w-fit flex-grow rounded-md bg-white drop-shadow-md">
						<img src={movie.img} className="h-36 rounded-md object-contain drop-shadow-md sm:h-48" />
						<div className="flex flex-grow flex-col justify-between p-2">
							<div>
								<p className="text-lg font-semibold sm:text-xl">{movie.name}</p>
								<p>length : {movie.length || '-'} min.</p>
							</div>

						</div>
					</div>
				)
			})}
		</div>
	) : (
		<div>No movies found</div>
	)
}

export default MovieLists
