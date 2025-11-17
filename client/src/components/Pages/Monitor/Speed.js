import {DataPanel} from "./Speed/DataPanel"
import React, {useEffect, useState} from 'react'
import {api} from "../../../server/api"
import socketIOClient from "socket.io-client"
import {LineGraph} from "./Speed/LineGraph"
import styled from 'styled-components'
import {Clock} from "../../Generic/Clock"
import {useCookies} from "react-cookie"


let socket

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

const ResponsiveFlex = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media (max-width: 1045px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const ResponsiveIndicatorsWithScrollbar = styled.div`
  width: 50%;
  overflow-y: scroll;
  height: 60vh;

  @media (max-width: 1045px) {
    width: 100%;
    overflow: auto;
    height: 100%;
  }
`

const ResponsiveIndicators = styled(HideScrollbars)`
  width: 50%;
  overflow: scroll;
  height: 60vh;

  @media (max-width: 1045px) {
    width: 100%;
    overflow: auto;
    height: 100%;
  }
`

export const Speed = ({socketData}) => {

	const [cookies] = useCookies(['auth'])

	const handleClick = () => {
		api.post("/end", {}, cookies.data.token).then((data) => {
			console.log(`Ended! Setting data: ${JSON.stringify(data.data)}`)
		})
	}

	console.log("GENERATED!")


	return (
		<React.Fragment>
			<div className={"d-flex flex-column w-100"}>
				<Clock/>
				<ResponsiveFlex>
					<ResponsiveIndicatorsWithScrollbar className={"m-4"}>
						<div>
							<DataPanel socketData={socketData}/>
						</div>
					</ResponsiveIndicatorsWithScrollbar>
					<ResponsiveIndicators className={"border m-4 rounded"}>
						<LineGraph values={socketData.speeds} min={socketData.min} max={socketData.max}/>
					</ResponsiveIndicators>
				</ResponsiveFlex>
				<div className={"w-100 d-flex justify-content-center"}>
					<button className={'m-auto btn btn-danger w-auto mt-4 mb-4'} onClick={handleClick}>Termina turno
					</button>
				</div>
			</div>
		</React.Fragment>
	)
}
