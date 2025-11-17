import React, {useState} from 'react'
import img from '../Calibrate/img.png'
import styled from "styled-components"

const Img = styled.img`
	object-fit: contain;
  height: 100%;
  margin: auto;
`

export const Photo = ({socket}) => {

	const [base64Image, setBase64Image] = useState(null)
	const [error, setError] = useState(null)

	socket.on('pictureAvailable', (photo) => {
		console.log(`photo arrived: ${JSON.stringify(photo)}`)
		setBase64Image(photo)
		setError('')
	})

	socket.on('pictureErrorAvailable', (err) => {
		console.log(`ERROR ${err}`)
		setError(err)
	})

	const handlePhoto = () => {
		socket.emit('requestPicture')
	}

	return (
		<div className={'w-100 h-100 d-flex flex-column align-items-center'}>
			<div className={'h-75'}>
				{ base64Image ? <Img className={'border'} alt={'photo taken'} src={`data:image/jpeg;base64,${base64Image.picture}`}/> : <></> }
			</div>
			<div className={'mt-4'}>
				<button className={'btn btn-outline-dark'} onClick={handlePhoto}>Scatta foto</button>
			</div>
			<div className={'mt-4 text-danger'}>
				{error?.error}
			</div>
			<div className={'mt-4'}>
				Generalmente ci vogliono 10 secondi per ottenere un'immagine
			</div>
		</div>
	)
}
