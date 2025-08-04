const Movie = require('../models/Movie')
const Showtime = require('../models/Showtime')
const axios = require('axios')

//@desc     GET all movies
//@route    GET /movie
//@access   Public
exports.getMovies = async (req, res, next) => {
	try {
		const movies = await Movie.find().sort({ createdAt: -1 })
		res.status(200).json({ success: true, count: movies.length, data: movies })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET showing movies
//@route    GET /movie/showing
//@access   Public
exports.getShowingMovies = async (req, res, next) => {
	try {
		const showingShowtime = await Showtime.aggregate([
			{ $match: { showtime: { $gte: new Date() }, isRelease: true } },
			{
				$lookup: {
					from: 'movies', // Replace "movies" with the actual collection name of your movies
					localField: 'movie',
					foreignField: '_id',
					as: 'movie'
				}
			},
			{
				$group: {
					_id: '$movie',
					count: { $sum: 1 }
				}
			},
			{
				$unwind: '$_id'
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$_id']
					}
				}
			},
			{
				$sort: { count: -1 }
			}
		])

		res.status(200).json({ success: true, data: showingShowtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET showing movies with all unreleased showtime
//@route    GET /movie/unreleased/showing
//@access   Private admin
exports.getUnreleasedShowingMovies = async (req, res, next) => {
	try {
		const showingShowtime = await Showtime.aggregate([
			{ $match: { showtime: { $gte: new Date() }, isRelease: true } },
			{
				$lookup: {
					from: 'movies', // Replace "movies" with the actual collection name of your movies
					localField: 'movie',
					foreignField: '_id',
					as: 'movie'
				}
			},
			{
				$group: {
					_id: '$movie',
					count: { $sum: 1 }
				}
			},
			{
				$unwind: '$_id'
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$_id']
					}
				}
			},
			{
				$sort: { count: -1, updatedAt: -1 }
			}
		])

		res.status(200).json({ success: true, data: showingShowtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET single movie
//@route    GET /movie/:id
//@access   Public
exports.getMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id)

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}

		res.status(200).json({ success: true, data: movie })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Create movie
//@route    POST /movie
//@access   Private
exports.createMovie = async (req, res, next) => {
	try {
		const movie = await Movie.create(req.body)
		res.status(201).json({
			success: true,
			data: movie
		})
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Search movie from OMDB
//@route    GET /movie/omdb/search
//@access   Private Admin
exports.searchMovieFromOMDB = async (req, res, next) => {
	try {
		const { title } = req.query
		if (!title) {
			return res.status(400).json({ success: false, message: 'Please provide a movie title' })
		}

		const omdbResponse = await axios.get(
			`http://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`
		)

		if (omdbResponse.data.Response === 'False') {
			return res.status(404).json({ success: false, message: omdbResponse.data.Error })
		}

		const movieExists = await Movie.findOne({ imdbID: omdbResponse.data.imdbID })

		res.status(200).json({ success: true, data: omdbResponse.data, isExisting: !!movieExists })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc     Create movie from OMDB
//@route    POST /movie/omdb
//@access   Private Admin
exports.createMovieFromOMDB = async (req, res, next) => {
	try {
		const { title } = req.body
		if (!title) {
			return res.status(400).json({ success: false, message: 'Please provide a movie title' })
		}

		const omdbResponse = await axios.get(
			`http://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`
		)

		if (omdbResponse.data.Response === 'False') {
			return res.status(404).json({ success: false, message: omdbResponse.data.Error })
		}

		const {
			Title,
			Year,
			Rated,
			Released,
			Runtime,
			Genre,
			Director,
			Writer,
			Actors,
			Plot,
			Language,
			Country,
			Awards,
			Poster,
			Ratings,
			imdbRating,
			imdbID,
			BoxOffice,
			Production
		} = omdbResponse.data

		const movieData = {
			name: Title,
			year: Year,
			rated: Rated,
			released: new Date(Released),
			length: parseInt(Runtime),
			genre: Genre,
			director: Director,
			writer: Writer,
			actors: Actors,
			plot: Plot,
			language: Language,
			country: Country,
			awards: Awards,
			img: Poster,
			ratings: Ratings,
			imdbRating,
			imdbID,
			boxOffice: BoxOffice,
			production: Production
		}

		const movie = await Movie.create(movieData)
		res.status(201).json({
			success: true,
			data: movie
		})
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ success: false, message: 'Movie with this imdbID already exists' })
		}
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc     Update movies
//@route    PUT /movie/:id
//@access   Private Admin
exports.updateMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}
		res.status(200).json({ success: true, data: movie })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Delete single movies
//@route    DELETE /movie/:id
//@access   Private Admin
exports.deleteMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id)

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}

		await movie.deleteOne()
		res.status(200).json({ success: true })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}
