import { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

const Coupons = () => {
	const { auth } = useContext(AuthContext)
	const [coupons, setCoupons] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [editingCoupon, setEditingCoupon] = useState(null)
	const { register, handleSubmit, reset, setValue } = useForm()

	const fetchCoupons = async () => {
		setIsLoading(true)
		try {
			const response = await axios.get('/coupon', {
				headers: { Authorization: `Bearer ${auth.token}` }
			})
			setCoupons(response.data.data)
		} catch (error) {
			toast.error('Failed to fetch coupons')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchCoupons()
	}, [])

	const onSubmit = async (data) => {
		setIsSubmitting(true)
		const apiCall = editingCoupon
			? axios.put(`/coupon/${editingCoupon._id}`, data, {
					headers: { Authorization: `Bearer ${auth.token}` }
			  })
			: axios.post('/coupon', data, {
					headers: { Authorization: `Bearer ${auth.token}` }
			  })

		try {
			await apiCall
			toast.success(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully!`)
			reset()
			setEditingCoupon(null)
			fetchCoupons()
		} catch (error) {
			toast.error(error.response?.data?.message || 'An error occurred')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this coupon?')) {
			try {
				await axios.delete(`/coupon/${id}`, {
					headers: { Authorization: `Bearer ${auth.token}` }
				})
				toast.success('Coupon deleted successfully!')
				fetchCoupons()
			} catch (error) {
				toast.error('Failed to delete coupon')
			}
		}
	}

	const handleEdit = (coupon) => {
		setEditingCoupon(coupon)
		setValue('code', coupon.code)
		setValue('discountPercentage', coupon.discountPercentage)
		setValue('validUntil', new Date(coupon.validUntil).toISOString().split('T')[0])
		setValue('isActive', coupon.isActive)
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">Manage Coupons</h2>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mb-4 flex flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4"
				>
					<h3 className="text-xl font-bold">{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						<input
							{...register('code', { required: true })}
							placeholder="Coupon Code"
							className="rounded px-3 py-1 font-semibold"
						/>
						<input
							{...register('discountPercentage', { required: true, valueAsNumber: true })}
							type="number"
							placeholder="Discount %"
							className="rounded px-3 py-1 font-semibold"
						/>
						<input
							{...register('validUntil', { required: true })}
							type="date"
							className="rounded px-3 py-1 font-semibold"
						/>
						<label className="flex items-center gap-2">
							<input {...register('isActive')} type="checkbox" defaultChecked />
							Is Active
						</label>
					</div>
					<div className="flex gap-2">
						<button
							type="submit"
							className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Add Coupon'}
						</button>
						{editingCoupon && (
							<button
								type="button"
								onClick={() => {
									setEditingCoupon(null)
									reset()
								}}
								className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
							>
								Cancel
							</button>
						)}
					</div>
				</form>

				{isLoading ? (
					<Loading />
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full rounded-md bg-white">
							<thead>
								<tr className="bg-gray-800 text-white">
									<th className="px-4 py-2">Code</th>
									<th className="px-4 py-2">Discount</th>
									<th className="px-4 py-2">Valid Until</th>
									<th className="px-4 py-2">Status</th>
									<th className="px-4 py-2">Actions</th>
								</tr>
							</thead>
							<tbody>
								{coupons.map((coupon) => (
									<tr key={coupon._id} className="border-b">
										<td className="px-4 py-2 text-center">{coupon.code}</td>
										<td className="px-4 py-2 text-center">{coupon.discountPercentage}%</td>
										<td className="px-4 py-2 text-center">
											{new Date(coupon.validUntil).toLocaleDateString()}
										</td>
										<td className="px-4 py-2 text-center">
											<span
												className={`rounded-full px-2 py-1 text-xs font-bold ${
													coupon.isActive && new Date(coupon.validUntil) > new Date()
														? 'bg-green-200 text-green-800'
														: 'bg-red-200 text-red-800'
												}`}
											>
												{coupon.isActive && new Date(coupon.validUntil) > new Date()
													? 'Active'
													: 'Inactive'}
											</span>
										</td>
										<td className="flex justify-center gap-2 px-4 py-2">
											<button
												onClick={() => handleEdit(coupon)}
												className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(coupon._id)}
												className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

export default Coupons 