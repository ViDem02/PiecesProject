import React, {useState} from 'react'
import {authApi} from "../../../server/authApi"
import {useCookies} from "react-cookie"


export const UserRow = ({userData}) => {

	const [deleted, setDeleted] = useState(false)
	const [cookie] = useCookies(['auth'])

	const handleDelete = () => {
		authApi.delete(`/delete/${userData.uid}`, {}, cookie.data.token).then(r => {
			setDeleted(true)
		}).catch(e => {
			alert(`Errore nell'eliminazione dell'utente!`)
			console.log(`Error in delete:  ${e}`)
		})
	}

	return (
		<tr className={deleted ? `bg-danger text-white`: ``}>
			<td>
				{userData.email}
			</td>
			<td className={'text-center'}>
				{userData.isAdmin ? "SI" : ""}
			</td>
			<td className={'text-center'}>
				{userData.tempPassword ? "SI" : ""}
			</td>
			<td>
				{
					deleted ? <></>:
						<button className={"btn btn-outline-danger"} onClick={handleDelete}>
							Delete
						</button>
				}

			</td>
		</tr>
	)
}
