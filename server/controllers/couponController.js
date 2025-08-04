const Coupon = require('../models/Coupon')

//@desc     Create a coupon
//@route    POST /coupon
//@access   Private/Admin
exports.createCoupon = async (req, res, next) => {
	try {
		const coupon = await Coupon.create(req.body)
		res.status(201).json({ success: true, data: coupon })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc     Get all coupons
//@route    GET /coupon
//@access   Private/Admin
exports.getCoupons = async (req, res, next) => {
	try {
		const coupons = await Coupon.find().sort({ createdAt: -1 })
		res.status(200).json({ success: true, count: coupons.length, data: coupons })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc     Update a coupon
//@route    PUT /coupon/:id
//@access   Private/Admin
exports.updateCoupon = async (req, res, next) => {
	try {
		const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})

		if (!coupon) {
			return res.status(404).json({ success: false, message: 'Coupon not found' })
		}

		res.status(200).json({ success: true, data: coupon })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc     Delete a coupon
//@route    DELETE /coupon/:id
//@access   Private/Admin
exports.deleteCoupon = async (req, res, next) => {
	try {
		const coupon = await Coupon.findByIdAndDelete(req.params.id)

		if (!coupon) {
			return res.status(404).json({ success: false, message: 'Coupon not found' })
		}

		res.status(200).json({ success: true, data: {} })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc     Validate a coupon
//@route    GET /coupon/validate/:code
//@access   Private
exports.validateCoupon = async (req, res, next) => {
	try {
		const coupon = await Coupon.findOne({
			code: req.params.code.toUpperCase(),
			isActive: true,
			validUntil: { $gte: new Date() }
		})

		if (!coupon) {
			return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' })
		}

		res.status(200).json({ success: true, data: coupon })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
} 