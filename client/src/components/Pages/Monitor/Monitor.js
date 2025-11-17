import React, {useEffect, useState} from 'react'
import {StartShift} from "./StartShift"
import {api} from "../../../server/api"
import {Speed} from "./Speed"
import socketIOClient from "socket.io-client"


export const Monitor = ({socket}) => {

	const [socketComm, setSocketComm] = useState({
		data: null,
		error: null,
		connecting: true
	})

	useEffect(() => {


		if (!socket.connected) {
			setSocketComm({
				data: null,
				error: {
					readableError: 'Not able to connect!'
				}
			})
		}

		socket.emit('requestData')

		socket.on("newData", data => {
			console.log(`Data received by socket!: ${JSON.stringify(data)}`)
			setSocketComm({data, error: null})
		})
		socket.on('error', error => {
			console.log(`Error received by socket!: ${JSON.stringify(error)}`)
			setSocketComm({error, data: null})
		})
	}, [])

	useEffect(() => {
		console.log(`Reloading! data = ${JSON.stringify(socketComm.data)}`)
	}, [socketComm.data])


	return (
		<React.Fragment>
			{
				socketComm.error ?
					<div className={"m-5"}>
						<div className="card text-white bg-danger mb-3 h-auto" style={{width: '18rem'}}>
							<div className="card-header" style={{fontWeight: 'bold'}}>Server error</div>
							<div className="card-body">
								<p className="card-text">{socketComm.error.readableError}</p>
							</div>
						</div>
					</div>
					:
					socketComm.data === null ?
						<>
							Connecting to socket
						</>
						:
						socketComm.data.endingTime ?
							<StartShift/>
							:
							<Speed socketData={socketComm.data}/>
			}
		</React.Fragment>

	)
}
