const express = require('express')
const {
	getMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
	getShowingMovies,
	getUnreleasedShowingMovies,
	createMovieFromOMDB,
	searchMovieFromOMDB
} = require('../controllers/movieController')
const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.route('/').get(getMovies).post(protect, authorize('admin'), createMovie)
router.route('/omdb').post(protect, authorize('admin'), createMovieFromOMDB)
router.route('/omdb/search').get(protect, authorize('admin'), searchMovieFromOMDB)
router.route('/showing').get(getShowingMovies)
router.route('/unreleased/showing').get(protect, authorize('admin'), getUnreleasedShowingMovies)
router
	.route('/:id')
	.get(getMovie)
	.put(protect, authorize('admin'), updateMovie)
	.delete(protect, authorize('admin'), deleteMovie)

module.exports = router
