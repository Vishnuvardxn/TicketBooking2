import { Link } from 'react-router-dom'

const PageNotFound = () => {
	return (
		<div className="flex h-screen flex-col items-center justify-center bg-gray-100">
			<h1 className="text-6xl font-bold text-gray-800">404</h1>
			<p className="text-xl text-gray-600">Page Not Found</p>
			<Link to="/" className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
				Go Home
			</Link>
		</div>
	)
}

export default PageNotFound 