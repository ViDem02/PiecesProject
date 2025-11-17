import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import App from "./App"
import styled from 'styled-components'
import {Monitor} from "./components/Pages/Monitor/Monitor"
import {Navbar} from "./components/Generic/Navbar"
import SocketHandler from "./components/socketHandler"
import {Data, OldData} from "./components/Pages/Data/Data"
import {Homepage} from "./components/Pages/Homepage/Homepage"
import {Graphics} from "./components/Pages/Graphics/Graphics"
import Sketch from "./Graphics/MainSketch/Sketch"
import {OldSketch} from "./Graphics/MainSketch/OldSketch"
import {Calibrate} from "./components/Pages/Calibrate/Calibrate"
import {Shift} from "./components/Pages/Shift/Shift"
import {Login} from "./components/Pages/Login/Login"
import {useCookies} from "react-cookie"
import {Redirect} from "react-router"
import {Logout} from "./components/Pages/Logout/Logout"
import {NoMatch} from "./components/Pages/NoMatch/NoMatch"
import axios from "axios"
import {Users} from "./components/Pages/Users/Users"
import {ChangePassword} from "./components/Pages/ChangePassword/ChangePassword"
import {Photo} from "./components/Pages/Photo/Photo"

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

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 90vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`

const InnerPageContainer = styled(HideScrollbars)`
  height: 95%;
  width: 95%;
  border: 1px gray solid;
  border-radius: 10px;
  justify-content: center;
  flex-direction: row;
  display: flex;
  overflow: scroll;

  @media (max-width: 1045px) {
    display: block;
  }
`


export const Routes = ({socket}) => {

	const [cookies, setCookie, removeCookie] = useCookies(['auth'])
	const [userData, setUserData] = useState({
		loaded: false,
		loggedIn: false
	})

	console.log(`Cookies: ${
		JSON.stringify(cookies.data)
	}`)

	useEffect(() => {
		let token = cookies.data?.token

		if (!token) {
			return setUserData({
				loaded: true,
				loggedIn: false
			})
		}

		const config = {
			headers: {Authorization: `Bearer ${token}`}
		}

		axios.get(`${process.env.REACT_APP_AUTH_LINK}/verify`, config).then(r => {
			setUserData({
				loaded: true,
				loggedIn: true
			})
		}).catch(e => {
			console.log(`Error in authentication: ${e}`)
			setUserData({
				loaded: true,
				loggedIn: false
			})
		})
	}, [])


	console.log(`userData: ${JSON.stringify(userData)}`)

	if (!userData.loaded) return (<></>)

	return (
		<Router>
			<Navbar/>
			<Switch>
				<PageContainer className={"frs-hide-scroll"}>
					<InnerPageContainer className={"frs-hide-scroll"}>
						{
							userData.loggedIn ?
								<React.Fragment>
									<Route path="/monitor" exact component={() => <Monitor socket={socket}/>} />
									<Route path="/data" exact component={Data}/>
									<Route path="/graphics" exact component={Graphics}/>
									<Route path="/calibrate" exact component={() => <Calibrate socket={socket}/>}/>
									<Route path="/shift/:id" exact component={Shift}/>
									<Route path="/logout" exact component={Logout}/>
									<Route path="/users" exact component={Users}/>
									<Route path="/change_password" exact component={ChangePassword}/>
									{/*<Route path="/photo" exact component={() => <Photo socket={socket}/>} />*/}
									<Route path="/" exact component={Graphics}/>
								</React.Fragment>
								:
								<React.Fragment>
									<Route path="/" component={Login}/>
								</React.Fragment>

						}
					</InnerPageContainer>
				</PageContainer>
			</Switch>
		</Router>
	)
}

export default Routes
