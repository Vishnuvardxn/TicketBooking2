const User = require('../models/User')

//@desc    Register user
//@route   POST /auth/register
//@access  Public
exports.register = async (req, res, next) => {
	try {
		const { username, email, password, role = 'user' } = req.body

		//Create user
		const user = await User.create({
			username,
			email,
			password,
			role
		})

		sendTokenResponse(user, 200, res)
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc		Login user
//@route	POST /auth/login
//@access	Public
exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body

		//Validate email & password
		if (!username || !password) {
			return res.status(400).json('Please provide an username and password')
		}

		//Check for user
		const user = await User.findOne({ username }).select('+password')

		if (!user) {
			return res.status(400).json('Invalid credentials')
		}

		//Check if password matches
		const isMatch = await user.matchPassword(password)

		if (!isMatch) {
			return res.status(401).json('Invalid credentials')
		}

		sendTokenResponse(user, 200, res)
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

const sendTokenResponse = (user, statusCode, res) => {
    // Create token without expiration
    const token = user.getSignedJwtToken(); // Ensure this function doesn't include an 'expiresIn' option

    // Set cookie options
    const options = {
        httpOnly: true, // Prevent client-side access
        // Do not set the 'expires' field for the cookie if you want it to last indefinitely
    };

    // Add secure flag for production
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // Send the response
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};

//@desc		Get current Logged in user
//@route 	POST /auth/me
//@access	Private
exports.getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id)
		res.status(200).json({
			success: true,
			data: user
		})
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc		Get tickets
//@route	GET /auth/tickets
//@access	Private
exports.getTickets = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).populate({
			path: 'tickets',
			populate: [
				{
					path: 'showtime',
					populate: [
						{
							path: 'movie'
						},
						{
							path: 'theater',
							populate: {
								path: 'cinema'
							}
						}
					]
				},
				{
					path: 'coupon'
				}
			]
		})
		res.status(200).json({ success: true, data: user })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc		Log user out / clear cookie
//@route 	GET /auth/logout
//@access	Private
exports.logout = async (req, res, next) => {
	try {
		res.cookie('token', 'none', {
			expires: new Date(Date.now() + 10 * 1000),
			httpOnly: true
		})

		res.status(200).json({
			success: true
		})
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc		Get All user
//@route 	POST /auth/user
//@access	Private Admin
exports.getAll = async (req, res, next) => {
	try {
		const user = await User.find().populate({
			path: 'tickets.showtime',
			populate: [
				'movie',
				{ path: 'theater', populate: { path: 'cinema', select: 'name' }, select: 'cinema number' }
			],
			select: 'theater movie showtime isRelease price'
		})

		res.status(200).json({
			success: true,
			data: user
		})
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc		Delete user
//@route 	DELETE /auth/user/:id
//@access	Private Admin
exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id)

		if (!user) {
			return res.status(400).json({ success: false })
		}
		res.status(200).json({ success: true })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Update user
//@route    PUT /auth/user/:id
//@access   Private
exports.updateUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})

		if (!user) {
			return res.status(400).json({ success: false, message: `User not found with id of ${req.params.id}` })
		}
		res.status(200).json({ success: true, data: user })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}
