import React, {useEffect, useState} from 'react'
import {Sketch} from "../../../Graphics/MainSketch/Sketch"
import OldSketch from "../../../Graphics/MainSketch/OldSketch"
import styled from "styled-components"
import socketIOClient from "socket.io-client"
import {api} from "../../../server/api"
import {useDispatch, useSelector} from "react-redux"
import {saveStatusData} from "../../../Redux/Actions/CounterActions"
import {Link} from "react-router-dom"
import {DateTime} from "luxon"
import {useCookies} from "react-cookie"

const debug = false

const HideScrollbars = styled.div`

  overflow: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */

  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

const CanvasContainer = styled.div`
  
  width: 70vw;
  height: 140vw;
  max-height: 1300px;
  max-width: 700px;
`

const CanvasScrollable = styled(HideScrollbars)`
  height: 100%;
  width: 70vw;
  max-height: 1300px;
  max-width: 700px;
  overflow: scroll;
  
`

const ResponsiveFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;

  @media (max-width: 1600px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Title = styled.div`
  width: 45vw;
  text-align: center;
  font-size: 10vw;
  @media (max-width: 1600px) {
    width: 100%;
  }
`

export const Graphics = () => {

	const dispatch = useDispatch()
	const dataLoaded = useSelector(state => state.statusData)

	const [cookies] = useCookies(['auth'])

	const refreshData = () => {

		api.get("/status", cookies.data.token).then((data) => {
			console.log(`Setting status dispatching sus`)
			dispatch(saveStatusData({
				time: DateTime.now(),
				data: data,
				error: null,
				loaded: true
			}))
		}).catch(e => {
			console.log(`Error in request /status: ${e}`)
			dispatch(saveStatusData({
				time: DateTime.now(),
				data: [{
					'device': 'restapi',
					'status': false
				}],
				error: 'Errore nella richiesta dello stato infrastruttura',
				loaded: true
			}))

		})
	}

	useEffect(() => refreshData(), [])


	if (debug) return (
		<React.Fragment>
			<canvas id="paper-canvas" resize="true" style={{
				height: '2000px',
				width: '1200px'
			}}/>
			<Sketch/>
		</React.Fragment>
	)

	console.log(`Data Loaded: ${JSON.stringify(dataLoaded)}, error: ${dataLoaded.error}`)


	return (

		<HideScrollbars className={"w-100 h-100 d-flex justify-content-center"}>

			<React.Fragment>
				<ResponsiveFlex>

					<TitleContainer>
						<Title>
							MAT-PRK
						</Title>
						<div className={`w-100 text-center`}>
							{
								dataLoaded.loaded ?
									dataLoaded.error ?
										dataLoaded.error
										:
										`Il grafico mostra lo stato dell'infrastruttura alle ${dataLoaded.time.toFormat('HH:mm:ss')}`
									:
									`Caricamento stato dell'infrastruttura...`
							}

						</div>
						<div className={"d-flex justify-content-center"}>
							<Link style={{textDecoration: 'none'}} to={"/monitor"}>
								<button className={"btn btn-lg btn-outline-dark mt-4"}>
									Vai al monitor
								</button>
							</Link>

						</div>
					</TitleContainer>
					<CanvasScrollable className={"frs-hide-scroll"}>
						<CanvasContainer>
							<canvas id="paper-canvas" resize="true" className={"w-100 h-100"}/>
						</CanvasContainer>
					</CanvasScrollable>
				</ResponsiveFlex>

				<div>
					<Sketch/>
				</div>
			</React.Fragment>
		</HideScrollbars>
	)
}
