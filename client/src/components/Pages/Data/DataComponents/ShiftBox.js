import React from 'react'
import {DateTime} from 'luxon'
import {Link} from "react-router-dom"



export const ShiftBox = ({surface}) => {
	let finished = Boolean(surface.endingTime)
	let startDate = DateTime.fromISO(surface.startingTime).toFormat('HH:mm')
	let endDate = surface.endingTime ? DateTime.fromISO(surface.endingTime).toFormat('HH:mm') : "running..."

	if (!surface.order || !surface.model){
		return(<></>)
	}

	return(
		<div style={{width: '300px'}} className={`border border-dark rounded m-3 d-flex flex-column align-items-center ${finished ? `` : `bg-warning`}`}>
			<div className={"h2 w-100 text-center mt-1"} style={{fontWeight: 'normal'}}>
				{startDate} > {endDate}
			</div>
			<div className={"mt-1 d-flex align-items-center justify-content-between w-75"}>
				<div>
					Commessa
				</div>
				<div className={"h2 text-center"} style={{fontWeight: 'normal'}}>
					<div>
						{surface.order}
					</div>
				</div>
			</div>
			<div className={"mt-1 d-flex align-items-center justify-content-between w-75"}>
				<div>
					Modello
				</div>
				<div className={"h2 text-center"} style={{fontWeight: 'normal'}}>
					<div>
						{surface.model}
					</div>
				</div>
			</div>
			<div className={"mt-1 d-flex align-items-center justify-content-between w-75"}>
				<div className={"text-center w-100"} style={{fontWeight: 'normal'}}>
					<div>
						<samp>{surface._id}</samp>
					</div>
				</div>
			</div>
			<div>
				<Link to={`/shift/${surface._id}`}>
					<button className={"btn btn-outline-dark m-3"}>
						Dettaglio
					</button>
				</Link>
			</div>


		</div>
	)
}
