import React, {useEffect, useState} from 'react'
import axios from "axios"
import {useCookies} from "react-cookie"
import {Redirect, useHistory} from "react-router"
import {authApi} from "../../../server/authApi"


export const ChangePassword = ({redirectToHome}) => {

	const [password, setPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
	const [error, setError] = useState('')

	const [cookies] = useCookies(['auth']);

	const [redirect, setRedirect] = useState(false)

	const [success, setSuccess] = useState(false)


	let history = useHistory();

	const handleLogin = () => {
		if (newPassword !== newPasswordConfirm) return setError("Le password non coincidono")
		if (newPassword === '' || newPasswordConfirm === '' || password === '') return setError("Alcuni campi sono vuoti")
		authApi.put(`/change_password`, {
			password,
			newPassword
		}, cookies.data.token).then(d => {
			console.log(`Data: ${JSON. stringify(d.data.token)}`)
			if (redirectToHome || cookies.data.tempPassword){
				history.push('/');
				window.location.reload();
			}
			setSuccess(true)
		}).catch(e => {
			console.log(`Request error e = ${JSON.stringify(e)}, ${JSON.stringify(e?.response?.data)}, ${JSON.stringify(e?.response?.status)}`)
			e.response?.status < 500 && e.response?.status >= 400  ? setError("Dati non corretti"):setError("Errore nel sistema di autenticazione")
		})
	}

	console.log(`refresh`)

	useEffect(() => {
		setTimeout(() => {
			setSuccess(false)
		}, 2000)
	}, [success])

	useEffect(() => {
		setPassword('')
		setNewPassword('')
		setNewPasswordConfirm('')
		setError('')
	}, [success])

	useEffect(() => {
	}, [redirect])




	return(
		<div className={"d-flex flex-column align-items-center mt-4"}>
			<div className={"display-1"}>
				Cambia Password
			</div>
			<div className={"border border-dark p-4 rounded mt-4"} style={{width: '25%', minWidth: '400px'}}>
				<div className="form-group m-2">
					<label htmlFor="exampleInputPassword1">Password Precedente</label>
					<input name={"new_password"} autoComplete={'password'} type="password" className="form-control" id="exampleInputPassword1"  value={password} onChange={e => setPassword(e.target.value)}/>
				</div>
				<div className="form-group m-2">
					<label htmlFor="exampleInputPassword1">Nuova password</label>
					<input name={"password"} type="password" autoComplete={'new-password'} className="form-control"  value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
				</div>
				<div className="form-group m-2">
					<label htmlFor="exampleInputPassword1">Conferma nuova password</label>
					<input name={"password"} type="password" className="form-control" id="exampleInputPassword1"  value={newPasswordConfirm} onChange={e => setNewPasswordConfirm(e.target.value)}/>
				</div>
				<div className={'text-danger w-100 text-center'}>{error}</div>
				<div className={"d-flex justify-content-center mt-4"}>
					<button onClick={handleLogin} className={`btn btn-${success ? 'success' : 'outline-dark'}`}>Cambia</button>
				</div>
			</div>

		</div>
	)
}
