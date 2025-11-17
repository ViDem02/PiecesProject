import React from 'react'
import {ShiftBox} from "./ShiftBox"
import {CSVLink} from "react-csv"


export const ShiftGroup = ({groupData}) => {
	return (
		<div className={"w-100 mb-5"}>
			<div className={"w-100 d-flex flex-row justify-content-center align-items-center"}>
				<div className={"h1 text-center m-2"}>
					{groupData.dateOfRecords}
				</div>
			</div>
			<div className={"w-100 d-flex flex-wrap justify-content-center"}>
				{
					groupData.data.map(d => <ShiftBox surface={d} key={d._id}/>)
				}
			</div>
		</div>
	)
}
