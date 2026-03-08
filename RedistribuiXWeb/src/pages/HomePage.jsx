import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import MapComponent from '../components/Map'
function HomePage() {
	const [activePage, setActivePage] = useState('rooms')
	const navigate = useNavigate()

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
						<MapComponent locationId={role === 'StandManager' ? userLocationId : undefined}/>
					</section>
				</main>
			</div>
		</div>
	)
}

export default HomePage