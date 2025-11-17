import React from 'react'
import {Indicator} from "./Indicator"

export const DataGroup = ({children, title, last}) => {

	const margin = last ? "" : "mb-4"

	return (
		<div className={"border border-dark rounded " + margin}>
			<div className={"h2 text-center mb-1"}>
				{title}
			</div>
			<div style={{maxWidth: '300px'}}>

			</div>
			<div className={"d-flex justify-content-center align-items-center flex-wrap"}>
				{children}
			</div>
		</div>
	)
}
