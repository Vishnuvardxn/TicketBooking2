import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import TicketPrint from '../components/TicketPrint'
import { AuthContext } from '../context/AuthContext'
import { PrinterIcon } from '@heroicons/react/24/outline'

const Tickets = () => {
	const { auth } = useContext(AuthContext)
	const [tickets, setTickets] = useState([])
	const [isFetchingTicketsDone, setIsFetchingTicketsDone] = useState(false)
	const [selectedTicketForPrint, setSelectedTicketForPrint] = useState(null)

	const fetchTickets = async () => {
		try {
			setIsFetchingTicketsDone(false)
			const response = await axios.get('/auth/tickets', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			const userTickets = response.data.data.tickets || []
			setTickets(
				userTickets.sort((a, b) => {
					if (a.showtime.showtime > b.showtime.showtime) {
						return -1
					}
					return 1
				})
			)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingTicketsDone(true)
		}
	}

	useEffect(() => {
		fetchTickets()
	}, [])

	const handlePrint = (ticket) => {
		setSelectedTicketForPrint(ticket)
		setTimeout(() => {
			window.print()
			setSelectedTicketForPrint(null)
		}, 100)
	}

	return (
		<>
			<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8 print:hidden">
				<Navbar />
				<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
					<h2 className="text-3xl font-bold text-gray-900">My Tickets</h2>
					{isFetchingTicketsDone ? (
						<>
							{tickets.length === 0 ? (
								<p className="text-center">You have not purchased any tickets yet</p>
							) : (
								<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
									{tickets.map((ticket, index) => {
										const originalPrice = ticket.showtime.price * ticket.seats.length
										return (
											<div className="flex flex-col" key={index}>
												<ShowtimeDetails showtime={ticket.showtime} />
												<div className="flex h-full flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
													<div className="flex h-full flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
														<p className="whitespace-nowrap font-semibold">Seats : </p>
														<p className="text-left">
															{ticket.seats.map((seat) => seat.row + seat.number).join(', ')}
														</p>
														<p className="whitespace-nowrap">({ticket.seats.length} seats)</p>
														<div className="flex flex-col items-start gap-x-2">
															{ticket.coupon ? (
																<>
																	<p className="text-sm line-through">
																		Original: ${originalPrice.toFixed(2)}
																	</p>
																	<p className="whitespace-nowrap font-semibold">
																		Total: ${ticket.totalPrice.toFixed(2)} ({ticket.coupon.discountPercentage}% off)
																	</p>
																</>
															) : (
																<p className="whitespace-nowrap font-semibold">
																	Total: ${originalPrice.toFixed(2)}
																</p>
															)}
														</div>
													</div>
													<button
														onClick={() => handlePrint(ticket)}
														className="flex items-center justify-center gap-2 rounded-b-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-4 py-2 font-semibold text-white hover:from-indigo-500 hover:to-blue-400 md:rounded-none md:rounded-br-lg"
													>
														<PrinterIcon className="h-6 w-6" />
														Print Ticket
													</button>
												</div>
											</div>
										)
									})}
								</div>
							)}
						</>
					) : (
						<Loading />
					)}
				</div>
			</div>
			{selectedTicketForPrint && <TicketPrint ticket={selectedTicketForPrint} />}
		</>
	)
}

export default Tickets
