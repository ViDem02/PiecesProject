import React, {useEffect, useState} from 'react'
import {api} from "../../../server/api"
import {CSVLink, CSVDownload} from "react-csv"
import {useCookies} from "react-cookie"


export const OldData = () => {

	const [surfaceData, setSurfaceData] = useState(null)
	const [data, setData] = useState(null)
	const [shiftData, setShiftData] = useState(null)

	const [cookies] = useCookies(['auth'])

	useEffect(() => {
		if (surfaceData === null) api.get('/surface', cookies.data.token).then(data => {
			console.log(`SURFACE DATA: ${JSON.stringify(data)}`)
			setSurfaceData(data)
		})
		/*if (data === null && surfaceData !== null) api.get('/shifts', cookies.data.token).then(data => {
			console.log(`DEEP DATA: ${JSON.stringify(data)}`)
			setData(data)
		})*/
	}, [surfaceData])

	const getDate = (date) => {
		let d = new Date(date)
		return `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`
	}
	const getTime = (date) => {
		let d = new Date(date)
		return `${d.getHours()}:${d.getMinutes()}`
	}

	const TimeComp = ({timestamp}) => {
		if (!timestamp) return <td>Running...</td>
		return (
			<td>
				<div style={{fontWeight: "bold"}}>
					{getTime(timestamp)}
				</div>
				<div>
					{getDate(timestamp)}
				</div>

			</td>
		)
	}

	const handleRowCLick = (metrics) => {
		console.log(`Handle Row Click: ${JSON.stringify(metrics)}`)
	}


	const getMetrics = (id) => {
		if (data) {
			return data.filter(d => {
				return d._id === id
			})[0].metrics
		} else {
			return []
		}
	}

	const RowsComp = () => {
		return (
			surfaceData ? surfaceData.map(d => {
				console.log(`GENERATING ROW FOR: ${d._id}, Get metrics: ${JSON.stringify(d._id)}`)
				return (
					<tr>
						<TimeComp timestamp={d.startingTime}/>
						<TimeComp timestamp={d.endingTime}/>
						<td>{d.avg}</td>
						<td>
							{
								/*getMetrics(d._id).length === 0 ? <></> :
									<button className={'btn btn-primary w-auto'}>
										<CSVLink data={getMetrics(d._id)}>
											<div style={{color: 'white', textDecoration: 'none'}}>
												Scarica CSV dati...
											</div>
										</CSVLink>
									</button>*/
							}
						</td>
					</tr>
				)
			}) : <></>
		)
	}

	if (surfaceData === null) return (
		<div>Loading...</div>
	)


	return (
		<div className={"w-100 h-100"}>
			<div className={"d-flex justify-content-center flex-column w-100"}>
				<button className={'m-auto btn btn-primary w-auto mt-4 mb-4'}>
					<CSVLink data={surfaceData}>
						<div style={{color: 'white', textDecoration: 'none'}}>
							Scarica CSV turni
						</div>
					</CSVLink>
				</button>


			</div>
			<table className="table">
				<thead>
				<tr>
					<th scope="col">Start</th>
					<th scope="col">End</th>
					<th scope="col">Avg</th>
					<th scope="col">Actions</th>
				</tr>
				</thead>
				<tbody>
				<RowsComp data={surfaceData}/>
				</tbody>
			</table>
		</div>
	)
}
