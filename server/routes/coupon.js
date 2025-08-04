const express = require('express')
const {
	createCoupon,
	getCoupons,
	updateCoupon,
	deleteCoupon,
	validateCoupon
} = require('../controllers/couponController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.get('/validate/:code', protect, validateCoupon)

router.route('/').get(protect, authorize('admin'), getCoupons).post(protect, authorize('admin'), createCoupon)
router
	.route('/:id')
	.put(protect, authorize('admin'), updateCoupon)
	.delete(protect, authorize('admin'), deleteCoupon)

module.exports = router 