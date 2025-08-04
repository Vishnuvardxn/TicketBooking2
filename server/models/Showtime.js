const mongoose = require('mongoose')

const showtimeSchema = new mongoose.Schema({
	theater: { type: mongoose.Schema.ObjectId, ref: 'Theater' },
	movie: { type: mongoose.Schema.ObjectId, ref: 'Movie' },
	showtime: Date,
	price: { type: Number, required: [true, 'Please add a ticket price'], default: 10 },
	seats: [
		{
			row: { type: String, required: [true, 'Please add a seat row'] },
			number: { type: Number, required: [true, 'Please add a seat number'] },
			user: { type: mongoose.Schema.ObjectId, ref: 'User' }
		}
	],
	isRelease: { type: Boolean, default: true }
})

showtimeSchema.pre('deleteOne', { document: true, query: true }, async function (next) {
	const showtimeId = this._id
	await this.model('User').updateMany(
		{ 'tickets.showtime': showtimeId },
		{ $pull: { tickets: { showtime: showtimeId } } }
	)
	next()
})

module.exports = mongoose.model('Showtime', showtimeSchema)
