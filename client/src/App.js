import React, {Component} from 'react'
import logo from './logo.svg'
import './App.css'

import SocketHandler from './components/socketHandler'
import {Routes} from "./routes"
import socketIOClient from "socket.io-client"

export const App = () => {

	console.log(`Connecting to socket: ${process.env.REACT_APP_SOCKET_LINK}`)
	const socket = socketIOClient(process.env.REACT_APP_SOCKET_LINK)
	socket.connect()

	socket.on('connect',() =>  {
		console.log(`Connected from HEAD!`)
	})

	return (
		<Routes socket={socket}/>
	)
}

export default App
