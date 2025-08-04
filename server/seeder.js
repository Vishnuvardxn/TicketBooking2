const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Movie = require('./models/Movie')
const Theater = require('./models/Theater')
const Showtime = require('./models/Showtime')

// Load env vars
dotenv.config({ path: './.env' })

// Connect to DB
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

const importData = async () => {
	try {
		console.log('Fetching existing movies and theaters...')
		const movies = await Movie.find()
		const theaters = await Theater.find()

		if (movies.length === 0 || theaters.length === 0) {
			console.log('No movies or theaters found. Please add some before seeding showtimes.')
			process.exit()
		}

		console.log(`Found ${movies.length} movies and ${theaters.length} theaters.`)

		const showtimesToCreate = []
		const startDate = new Date()
		const endDate = new Date(startDate.getFullYear(), 8, 30) // End of September

		const showtimeHours = [10, 13, 16, 19, 22] // 5 showtimes per day

		console.log(`Generating showtimes from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}...`)

		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			for (const theater of theaters) {
				for (const hour of showtimeHours) {
					const randomMovie = movies[Math.floor(Math.random() * movies.length)]
					const price = (Math.random() * (18 - 12) + 12).toFixed(2) // Price between 12 and 18

					const showtimeDate = new Date(d)
					showtimeDate.setHours(hour, 0, 0, 0)

					showtimesToCreate.push({
						movie: randomMovie._id,
						theater: theater._id,
						showtime: showtimeDate,
						price: parseFloat(price),
						isRelease: true
					})
				}
			}
		}
		
		console.log(`Creating ${showtimesToCreate.length} showtimes...`)
		await Showtime.insertMany(showtimesToCreate)

		console.log('Showtimes Imported!')
		process.exit()
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

const deleteData = async () => {
	try {
		console.log('Deleting all showtimes...')
		await Showtime.deleteMany()
		console.log('All Showtimes Destroyed!')
		process.exit()
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

if (process.argv[2] === '-i') {
	importData()
} else if (process.argv[2] === '-d') {
	deleteData()
} else {
	console.log('Please add an option: -i to import data, -d to destroy data')
	process.exit()
} 