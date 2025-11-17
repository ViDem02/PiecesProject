import {Link} from 'react-router-dom'
import React from 'react'
import {useCookies} from "react-cookie"

export const Navbar = () => {

	const [cookies] = useCookies(['auth'])

	return (
		<div className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<div className="navbar-brand">MAT-PRK</div>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse"
				        data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
				        aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"/>
				</button>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
					<div className="navbar-nav">


						<Link className="nav-link" aria-current="page" to={'/'}>Home</Link>
						<Link className="nav-link" to={'/monitor'}>Monitor</Link>
						<Link className="nav-link" to={'/data'}>Archivio dati</Link>
						<Link className="nav-link" to={'/calibrate'}>Gestisci sensore</Link>
						{/*<Link className="nav-link" to={'/photo'}>Fotocamera remota</Link>*/}
						{
							cookies.data?.admin ?
								<Link className="nav-link" to={'/users'}>Gestisci utenti</Link>
								: <></>
						}
						{
							cookies.data?.email ?
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown"
									   role="button" data-bs-toggle="dropdown" aria-expanded="false">
										{cookies.data.email}
									</a>
									<ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
										<li><Link className="nav-link" to={'/change_password'}>Cambia Password</Link>
										</li>
										<li><Link className="nav-link" to={'/logout'}>Esci</Link></li>
									</ul>
								</li> : <></>
						}


					</div>
				</div>
			</div>
		</div>
	)
}
