import React, {useEffect, useState} from 'react'
import {useCookies} from "react-cookie"
import {api} from "../../../server/api"
import axios from "axios"
import {authApi} from "../../../server/authApi"
import {UserRow} from "./UserRow"

export const Users = () => {

	const [userData, setUserData] = useState({
		error: null,
		data: null,
		loaded: false
	})


	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [admin, setAdmin] = useState(false)

	const [success, setSuccess] = useState(false)

	const [cookies] = useCookies(['auth'])

	const handleRegister = () => {
		if (email === '' && password === '') return setError("L'email e password sono richiesti")
		authApi.post(`/register`, {
			email,
			password,
			admin
		}, cookies.data.token).then(d => {
			console.log(`Success: ${JSON.stringify(d)}`)
			setSuccess(true)
		}).catch(e => {
			console.log(`Request error e = ${JSON.stringify(e)}, ${JSON.stringify(e?.response?.data)}, ${JSON.stringify(e?.response?.status)}`)
			e.response?.status < 500 && e.response?.status >= 400  ? setError("Dati non corretti"):setError("Errore nel sistema di autenticazione")
		})
	}


	useEffect(() => {
		setTimeout(() => {
			setSuccess(false)
		}, 2000)
	}, [success])

	useEffect(() => {
		authApi.get(`/users`, cookies.data.token).then(users => {
			console.log(`Gotten users: ${users}`)
			setUserData({
				data: users,
				error: null,
				loaded: true
			})
		}).catch(e => {
			console.log(`Error in fetching data: ${e}`)
			setUserData({
				error: e,
				data: null,
				loaded: true
			})
		})

	}, [success])


	if (!userData.loaded) return(
		<div className={"w-100 text-center mt-4"}>
			Loading...
		</div>
	)

	return (
		<div className={"w-100"}>
			<div className={"w-100 text-center display-1"}>
				Utenti
			</div>
			<div className={'d-flex justify-content-center mt-4'}>
				<div className={"border border-dark p-4 rounded mt-4"} style={{width: '25%', minWidth: '400px'}}>
					<div className={'h2 w-100 text-center'}>Pannello creazione utente</div>
					<div className="form-group m-2">
						<label htmlFor="exampleInputEmail1">Email</label>
						<input name={"email"} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"  value={email}  onChange={e => setEmail(e.target.value)}/>
					</div>
					<div className="form-group m-2">
						<label htmlFor="exampleInputPassword1">Password Temporanea</label>
						<input name={"password"} type="password" className="form-control" id="exampleInputPassword1"  value={password} onChange={e => setPassword(e.target.value)}/>
					</div>

					<div className={'text-danger w-100 text-center'}>{error}</div>
					<div className={"d-flex justify-content-center mt-4"}>
						<button onClick={handleRegister} className={`btn btn-outline-${success ? 'success': 'dark'}`}>Registra</button>
					</div>
				</div>
			</div>
			<div className={'d-flex justify-content-center mt-4 border p-2'}>
				<table className={'table w-auto'}>
					<tbody>
						<tr >
							<th>Email</th>
							<th>Admin</th>
							<th>Password temporanea</th>
							<th>Actions</th>
						</tr>
						{userData.data.map(u => <UserRow userData={u} key={u.uid}/>)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
