import React, {useEffect, useState} from 'react'
import axios from "axios"
import {useCookies} from "react-cookie"
import {Redirect, useHistory} from "react-router"


export const Login = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const [cookies, setCookie, removeCookie] = useCookies(['auth']);

	const [redirect, setRedirect] = useState(false)

	let history = useHistory();

	const handleLogin = () => {
		if (email === '' && password === '') return setError("L'email e password sono richiesti")
		console.log(`AUTH: ${process.env.REACT_APP_AUTH_LINK}`)
		axios.post(`${process.env.REACT_APP_AUTH_LINK}/login`, {
			email,
			password
		}).then(d => {
			console.log(`Data: ${JSON.stringify(d.data.token)}`)
			setCookie('data', d.data, { path: '/' })
			console.log(`cookies set`);
			d.data.tempPassword ? history.push('/change_password') : history.push('/')
			window.location.reload();
		}).catch(e => {
			console.log(`Request error e = ${JSON.stringify(e)}, ${JSON.stringify(e?.response?.data)}, ${JSON.stringify(e?.response?.status)}`)
			e.response?.status < 500 && e.response?.status >= 400  ? setError("Dati non corretti"):setError("Errore nel sistema di autenticazione")
		})
	}

	console.log(`refresh`)

	useEffect(() => {
	}, [redirect])


	return(
		<div className={"d-flex flex-column align-items-center mt-4"}>
			<div className={"display-1"}>
				Login
			</div>
			<div className={"border border-dark p-4 rounded mt-4"} style={{width: '25%', minWidth: '400px'}}>
					<div className="form-group m-2">
						<label htmlFor="exampleInputEmail1">Email</label>
						<input name={"email"} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"  value={email}  onChange={e => setEmail(e.target.value)}/>
					</div>
					<div className="form-group m-2">
						<label htmlFor="exampleInputPassword1">Password</label>
						<input name={"password"} type="password" className="form-control" id="exampleInputPassword1"  value={password} onChange={e => setPassword(e.target.value)}/>
					</div>
					<div className={'text-danger w-100 text-center'}>{error}</div>
					<div className={"d-flex justify-content-center mt-4"}>
						<button onClick={handleLogin} className="btn btn-outline-dark">Accedi</button>
					</div>
			</div>

		</div>
	)
}
