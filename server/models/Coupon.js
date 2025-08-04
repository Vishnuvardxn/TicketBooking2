const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: [true, 'Please add a coupon code'],
			unique: true,
			trim: true,
			uppercase: true
		},
		discountPercentage: {
			type: Number,
			required: [true, 'Please add a discount percentage'],
			min: 0,
			max: 100
		},
		validUntil: {
			type: Date,
			required: [true, 'Please add a validity date']
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Coupon', CouponSchema) 