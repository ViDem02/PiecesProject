import React from 'react'
import {useCookies} from "react-cookie"
import {Redirect} from "react-router"
import {useHistory} from "react-router"

export const Logout = () => {

	const [cookies, setCookie, removeCookie] = useCookies(['auth']);

	const history = useHistory()

	removeCookie('data')
	history.push('/login')
	window.location.reload()

	return (
		<Redirect
			to={'/login'}
		/>
	)
}
