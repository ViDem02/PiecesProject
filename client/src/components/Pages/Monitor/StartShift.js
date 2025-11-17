import React, {useEffect, useState} from 'react'
import {api} from "../../../server/api"
import {Clock} from "../../Generic/Clock"
import {Input} from "../../Generic/Input"
import {useCookies} from "react-cookie"


function appendLeadingZeroes(n) {
	if (n <= 9) {
		return "0" + n
	}
	return n
}

function getFormattedTime() {
	let current_datetime = new Date()
	let formatted_date = appendLeadingZeroes(current_datetime.getHours()) + ":" + appendLeadingZeroes(current_datetime.getMinutes()) + ":" + appendLeadingZeroes(current_datetime.getSeconds())
	return formatted_date
}


export const StartShift = () => {

	const [dt, setDt] = useState(getFormattedTime())
	const [order, setOrder] = useState('')
	const [model, setModel] = useState('')
	const [error, setError] = useState('')
	const [totPieces, setTotPieces] = useState(0)

	useEffect(() => {
		let secTimer = setInterval(() => {
			setDt(getFormattedTime())
		}, 1000)

		return () => clearInterval(secTimer)
	}, [])

	const [cookies] = useCookies(['auth'])

	const handleClick = () => {
		if (order === '' || model === ''){
			return setError(`Alcuni dati non sono stati inseriti`)
		}
		if (totPieces === 0){
			return setError(`Inserire il numero di pezzi da produrre`)
		}
		api.post("/start", {
			order, model, totPieces
		}, cookies.data.token).then(
			(data) => {
				console.log(`data of created obj = ${JSON.stringify(data.data)}`)
			}
		)
	}



	return (

		<div className={"d-flex justify-content-center align-items-center flex-column w-100"}>
			<Clock/>
			<Input title={"Commessa"} value={order} changeValue={setOrder}/>
			<Input title={"Modello"} value={model} changeValue={setModel}/>
			<Input title={"Pezzi da produrre"} value={totPieces} changeValue={setTotPieces} type={"number"} min={1}/>
			<div className={"text-danger"}>
				{error}
			</div>
			<button className={'m-auto btn btn-success w-auto mt-4'} onClick={handleClick}>Inizia turno</button>
		</div>

	)
}
