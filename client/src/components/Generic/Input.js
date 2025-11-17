import React, {useEffect, useState} from 'react'


export const Input = ({value, changeValue, title, type, min, max}) => {


	return (
		<div className="input-group m-2" style={{maxWidth: '400px'}}>
			<span className="input-group-text" id="basic-addon3">{title}</span>
			<input type={type ?? 'text'} value={value} onChange={e => changeValue(e.target.value)}
			       className="form-control" id="basic-url" aria-describedby="basic-addon3" min={min} max={max}/>
		</div>
	)
}
