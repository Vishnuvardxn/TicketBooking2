import { TicketIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Purchase = () => {
	const navigate = useNavigate()
	const { auth } = useContext(AuthContext)
	const location = useLocation()
	const showtime = location.state.showtime
	const selectedSeats = location.state.selectedSeats || []
	const [isPurchasing, setIsPurchasing] = useState(false)
	const [couponCode, setCouponCode] = useState('')
	const [discount, setDiscount] = useState(0)
	const [finalPrice, setFinalPrice] = useState(showtime.price * selectedSeats.length)

	const applyCoupon = async () => {
		try {
			const response = await axios.get(`/coupon/validate/${couponCode}`, {
				headers: { Authorization: `Bearer ${auth.token}` }
			})
			const discountPercentage = response.data.data.discountPercentage
			setDiscount(discountPercentage)
			const discountedPrice = (showtime.price * selectedSeats.length * (100 - discountPercentage)) / 100
			setFinalPrice(discountedPrice)
			toast.success('Coupon applied successfully!')
		} catch (error) {
			setDiscount(0)
			setFinalPrice(showtime.price * selectedSeats.length)
			toast.error(error.response?.data?.message || 'Failed to apply coupon')
		}
	}

	const onPurchase = async () => {
		setIsPurchasing(true)
		try {
			const purchaseData = { seats: selectedSeats }
			if (couponCode) {
				purchaseData.couponCode = couponCode
			}
			await axios.post(`/showtime/${showtime._id}`, purchaseData, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			toast.success('Purchase successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			navigate('/ticket')
		} catch (error) {
			console.error(error)
			toast.error(error.response.data.message || 'Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			setIsPurchasing(false)
		}
	}

	const originalPrice = showtime.price * selectedSeats.length

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
			<Navbar />
			<div className="mx-4 h-fit rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<ShowtimeDetails showtime={showtime} />
				<div className="flex flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
					<div className="flex flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
						<p className="font-semibold">Selected Seats : </p>
						<p className="text-start">{selectedSeats.join(', ')}</p>
						{!!selectedSeats.length && (
							<>
								<p className="whitespace-nowrap">({selectedSeats.length} seats)</p>
								<div className="flex flex-col items-start">
									{discount > 0 ? (
										<>
											<p className="text-sm line-through">
												Original: ${originalPrice.toFixed(2)}
											</p>
											<p className="whitespace-nowrap font-semibold">
												Total: ${finalPrice.toFixed(2)} ({discount}% off)
											</p>
										</>
									) : (
										<p className="whitespace-nowrap font-semibold">
											Total: ${originalPrice.toFixed(2)}
										</p>
									)}
								</div>
							</>
						)}
					</div>
					{!!selectedSeats.length && (
						<button
							onClick={onPurchase}
							className="flex items-center justify-center gap-2 rounded-b-lg  bg-gradient-to-br from-indigo-600 to-blue-500 px-4 py-1 font-semibold text-white hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-500 disabled:to-slate-400 md:rounded-none md:rounded-br-lg"
							disabled={isPurchasing}
						>
							{isPurchasing ? (
								'Processing...'
							) : (
								<>
									<p>Confirm Purchase</p>
									<TicketIcon className="h-7 w-7 text-white" />
								</>
							)}
						</button>
					)}
				</div>
				<div className="mt-4 flex items-center gap-2 p-4">
					<input
						type="text"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
						placeholder="Enter Coupon Code"
						className="rounded-md border border-gray-300 p-2"
					/>
					<button
						onClick={applyCoupon}
						className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	)
}

export default Purchase
