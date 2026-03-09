import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import MapComponent from '../components/Map'
import { STATUS_TRANSFER, getAuthToken, buildAuthHeaders } from '../utils/transferHelpers'
function HomePage() {
	const [activePage, setActivePage] = useState('rooms')
	const navigate = useNavigate()
	const [incomingTransfersCount, setIncomingTransfersCount] = useState(0)
	const [isTransfersLoading, setIsTransfersLoading] = useState(false)

	const handleNavigate = (pageId) => {
		setActivePage(pageId)
		if (pageId === 'profile') {
			navigate('/profile')
		}
		if(pageId === 'locations'){
			navigate('/locations')
		}
		if(pageId === 'products'){
			navigate('/products')
		}
		if(pageId === 'home'){
			navigate('/home')
		}
	}

	const handleLogout = () => {
		console.log('it gets here')
		navigate('/auth')
	}

	const storedAuth = window.localStorage.getItem('redistribuix_auth')
	const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null
	const role = parsedAuth?.role || 'StandManager'
	const userLocationId = parsedAuth?.user?.locationId || parsedAuth?.locationId

	useEffect(() => {
		if (role !== 'StandManager' || !userLocationId) return

		async function fetchIncomingTransfers() {
			try {
				setIsTransfersLoading(true)
				const token = getAuthToken()
				const headers = buildAuthHeaders(token)
				const status = STATUS_TRANSFER.ManuallyApproved
				const res = await fetch(`http://localhost:5056/api/v1/TransferBatch/location/${userLocationId}/status/${status}`, {
					method: 'GET',
					headers,
				})

				if (!res.ok) {
					setIncomingTransfersCount(0)
					return
				}

				const data = await res.json()
				setIncomingTransfersCount(Array.isArray(data) ? data.length : 0)
			} catch (err) {
				console.error('Failed to load incoming transfers for manager:', err)
				setIncomingTransfersCount(0)
			} finally {
				setIsTransfersLoading(false)
			}
		}

		fetchIncomingTransfers()
	}, [role, userLocationId])

	if (role === 'Admin') {
		// window.location.replace('/products')
		// return null
	}

	return (
		<div className="min-h-screen bg-white text-[#4b5563] flex">
			<SideMenu
				activePage={activePage}
				onNavigate={handleNavigate}
				userName="Alexia"
				onLogout={handleLogout}
				role={role}
			/>

			<div className="flex-1 flex flex-col ml-16 relative z-10">
				<main className="px-6 py-8 md:px-10 md:py-10">
					<section className="max-w-5xl mx-auto space-y-6">
						<div className="space-y-2">
							<h1 className="text-3xl font-semibold tracking-tight">Welcome to RedistribuiX!</h1>
						</div>

						{role === 'StandManager' && !isTransfersLoading && incomingTransfersCount > 0 && (
							<div className="mt-4 mb-2 rounded-2xl border border-[#3e3e8a] bg-[#ebebfb] px-4 py-3 flex items-center gap-3 text-sm text-[#3e3e8a]">
								<span className="text-lg">📦</span>
								<span className="flex-1">
									You have <strong>{incomingTransfersCount}</strong> transfer{incomingTransfersCount !== 1 ? 's' : ''} waiting to be received.
								</span>
								<button
									type="button"
									className="rounded-xl bg-[#4d4dff] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#3d3dff] transition-colors"
									onClick={() => navigate('/suggestedTransfer')}
								>
									View transfers
								</button>
							</div>
						)}
						<MapComponent locationId={role === 'StandManager' ? userLocationId : undefined}/>
					</section>
				</main>
			</div>
		</div>
	)
}

export default HomePage