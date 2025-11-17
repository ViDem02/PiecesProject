import React, {useEffect, useState} from 'react'
import {api} from "../../../server/api"
import {ShiftGroup} from "./DataComponents/ShiftGroup"
import {useCookies} from "react-cookie"

export const Data = () => {

	const [surfaceData, setSurfaceData] = useState({
		error: null,
		data: null,
		loaded: false
	})

	const [cookies] = useCookies(['auth'])

	useEffect(() => {
		api.get(`/surface_by_day`, cookies.data.token).then(surface => {
			console.log(`Gotten surface: ${surface}`)
			setSurfaceData({
				data: surface,
				error: null,
				loaded: true
			})
		}).catch(e => {
			console.log(`Error in fetching data: ${e}`)
			setSurfaceData({
				error: e,
				data: null,
				loaded: true
			})
		})

	}, [])


	return (
		<div className={"w-100 p-5"}>
			{
				surfaceData.loaded ?
					surfaceData.error ?
						<div>Error!</div>
						:
						<div>
							{surfaceData.data.map(s => <ShiftGroup groupData={s} key={s.dateOfRecords}/> )}
						</div>

				:
					<div className={"w-100 text-center"}>Loading...</div>
			}
		</div>
	)
}
