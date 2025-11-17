import React, {useEffect, useState} from 'react'


function appendLeadingZeroes(n) {
	if (n <= 9) {
		return "0" + n
	}
	return n
}

function getFormattedTime(date) {
	let current_datetime = new Date()
	let text =  appendLeadingZeroes(current_datetime.getHours()) + ":" + appendLeadingZeroes(current_datetime.getMinutes()) + ":" + appendLeadingZeroes(current_datetime.getSeconds())
	return (text + " - " +  getFormattedDate())
}

function getFormattedDate(){
	let current_datetime = new Date()
	return appendLeadingZeroes(current_datetime.getDay()) + "/" + appendLeadingZeroes(current_datetime.getMonth()) + "/" + appendLeadingZeroes(current_datetime.getFullYear())
}


export const Clock = ({date}) => {

	const [dt, setDt] = useState(getFormattedTime())

	useEffect(() => {
		let secTimer = setInterval(() => {
			setDt(getFormattedTime())
		}, 1000)

		return () => clearInterval(secTimer)
	}, [])


	return (

		<div className={"d-flex justify-content-center flex-column w-100"}>
			<div className={'display-1 text-center'}>{dt}</div>
		</div>

	)
}
