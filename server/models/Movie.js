const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a movie name'],
			trim: true
		},
		length: {
			type: Number,
			required: [true, 'Please add a movie length']
		},
		img: {
			type: String,
			required: [true, 'Please add a movie img'],
			trim: true
		},
		plot: {
			type: String
		},
		rated: {
			type: String
		},
		released: {
			type: Date
		},
		genre: {
			type: String
		},
		director: {
			type: String
		},
		writer: {
			type: String
		},
		actors: {
			type: String
		},
		language: {
			type: String
		},
		country: {
			type: String
		},
		awards: {
			type: String
		},
		imdbRating: {
			type: String
		},
		imdbID: {
			type: String,
			unique: true
		},
		boxOffice: {
			type: String
		},
		production: {
			type: String
		},
		year: {
			type: String
		},
		ratings: {
			type: [
				{
					Source: String,
					Value: String
				}
			]
		}
	},
	{ timestamps: true }
)

movieSchema.pre('deleteOne', { document: true, query: true }, async function (next) {
	const movieId = this._id
	const showtimes = await this.model('Showtime').find({ movie: movieId })

	for (const showtime of showtimes) {
		await showtime.deleteOne()
	}
	next()
})

module.exports = mongoose.model('Movie', movieSchema)
