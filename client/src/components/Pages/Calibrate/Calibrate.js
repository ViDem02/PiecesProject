import React, {useEffect, useState} from 'react'
import {Indicator} from "../Monitor/Speed/Indicator"
import socketIOClient from "socket.io-client"
import {api} from "../../../server/api"
import info from './reverse.png'
import {useCookies} from "react-cookie"
import Countdown from 'react-countdown';

export const Calibrate = ({socket}) => {

	const [calMode, setCalMode] = useState(false)
	const [distance, setDistance] = useState("-")
	const [calSuccess, setCalSuccess] = useState(false)
	const [rebootSuccess, setRebootSuccess] = useState(false)
	const [haltSuccess, setHaltSuccess] = useState(false)

	const [cookies] = useCookies(['auth'])

	// Renderer callback with condition
	const renderer = ({ hours, minutes, seconds, completed }) => {
		if (completed) return <></>
		// Render a countdown
		return <span>{seconds}</span>
	};

	socket.on('distanceBroadcast', (distance) => {
		setDistance(distance)
	})

	const handleCalMode = () => {
		setCalMode(!calMode)
		api.post('/toggle_calmode', {}, cookies.data.token).then(r => console.log(`OK! r = ${r}`))
	}

	useEffect(() => {
		setTimeout(() => {
			setCalSuccess(false)
		}, 2000)
	}, [calSuccess])

	useEffect(() => {
		setTimeout(() => {
			setRebootSuccess(false)
		}, 2000)
	}, [rebootSuccess])

	useEffect(() => {
		setTimeout(() => {
			setHaltSuccess(false)
		}, 2000)
	}, [haltSuccess])


	const handleCalibrate = () => {
		socket.emit('requestCalibrate')
		setCalSuccess(true)
	}

	const handleReboot = () => {
		socket.emit('requestReboot')
		setRebootSuccess(true)
	}

	const handleHalt = () => {
		socket.emit('requestHalt')
		setHaltSuccess(true)
	}

	return (
		<div className={"w-100 h-100 d-flex flex-column align-items-center"}>
			<div className={"display-1 w-100 text-center"}>
				Gestisci sensore
			</div>
			<div className={"w-25 mt-4"} style={{minWidth: '300px', width: '100%'}}>
				<Indicator allowText={true} value={distance} measureUnit={"cm"} name={"Misura rilevata dal sensore"} fontSize={"200"}/>
			</div>

			<div className={"mt-6 d-flex flex-row w-100 justify-content-center"}>
				<button className={"btn btn-outline-dark btn-lg m-4"} onClick={handleCalMode}>{(calMode ? 'Ferma' : 'Avvia' ) + " modalità calibrazione"}</button>
				<button className={`btn btn-outline-${calSuccess ? 'success' : 'dark'} btn-lg m-4`} onClick={handleCalibrate} >Imposta</button>
				<button className={`btn btn-${rebootSuccess ? 'success' : 'outline-dark'} btn-lg m-4`} onClick={handleReboot} >
					Riavvia
				</button>
				<button className={`btn btn-${haltSuccess ? 'success' : 'outline-danger'} btn-lg m-4`} onClick={handleHalt} >
					Arresta
				</button>
			</div>
			<div style={{width: '80%', maxWidth: '570px'}}>
				<img src={info} className={"w-100"} alt="Informativa Calibrazione"/>
			</div>
		</div>
	)
}
