const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema(
	{
		showtime: {
			type: mongoose.Schema.ObjectId,
			ref: 'Showtime',
			required: true
		},
		seats: {
			type: [
				{
					row: String,
					number: Number
				}
			],
			required: true
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true
		},
		totalPrice: {
			type: Number,
			required: true
		},
		coupon: {
			type: mongoose.Schema.ObjectId,
			ref: 'Coupon',
			default: null
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Ticket', TicketSchema) 