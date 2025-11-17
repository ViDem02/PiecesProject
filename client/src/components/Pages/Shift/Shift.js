import React, {useEffect, useState} from 'react'
import {useParams} from "react-router"
import {api} from "../../../server/api"
import {DateTime} from "luxon"
import {DataPanel} from "../Monitor/Speed/DataPanel"
import {CSVLink, CSVDownload} from "react-csv"
import {useCookies} from "react-cookie"

export const Shift = () => {

	const {id} = useParams()

	const [shiftData, setShiftData] = useState({
		error: null,
		data: null,
		loaded: false
	})

	const [cookies] = useCookies(['auth'])

	useEffect(() => {
		api.get(`/surface_by_id/${id}`, cookies.data.token).then(surface => {
			console.log(`Gotten surface: ${surface}`)
			setShiftData({
				data: surface,
				error: null,
				loaded: true
			})
		}).catch(e => {
			console.log(`Error in fetching data: ${e}`)
			setShiftData({
				error: e,
				data: null,
				loaded: true
			})
		})

	}, [])

	let finished
	let startDate
	let endDate
	let day
	let filename

	if (shiftData.data) {
		let startDateObj =  DateTime.fromISO(shiftData.data.startingTime)
		let endDateObj = shiftData.data.endingTime ? DateTime.fromISO(shiftData.data.endingTime) : null

		startDate = startDateObj.toFormat('HH:mm')
		endDate = endDateObj ? endDateObj.toFormat('HH:mm') : "running..."
		day = startDateObj.toFormat('dd/MM/yyyy')

		filename = `dati_generali_${startDateObj.toFormat(`dd_MM_yyyy`)}_${startDateObj.toFormat(`HH:mm`)}_${endDateObj ? endDateObj.toFormat(`HH:mm`) : 'running'}.csv`

	}


	return (
		shiftData.loaded ?
			shiftData.error ?
				<div>Error: {shiftData.error}</div>
			:
			<div>
				<div className={"d-flex flex-column align-items-center w-100"}>
					<div className={"display-1 text-center"}>
						{startDate} > {endDate}
					</div>
					<div className={"display-3 text-center"}>
						{day}
					</div>

						<CSVLink data={Object.entries(shiftData.data)} filename={filename}>
							<button className={"btn btn-lg btn-outline-dark mt-4"}>
								Scarica CSV dati generali
							</button>
						</CSVLink>
					<div>
						<DataPanel socketData={shiftData.data} shiftVisualization={true}/>
					</div>
					<div className={"m-4"}>
						ID Shift: <samp>{id}</samp>
					</div>
				</div>
			</div>
		:
			<></>
	)
}
