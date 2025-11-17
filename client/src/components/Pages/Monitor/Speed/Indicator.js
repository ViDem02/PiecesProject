import React from 'react'

function getDecimal(input) {
	let n = Math.abs(input)
	return (n - Math.floor(n));
}

//TO WRITE TEXT HERE, SET "ALLOW TEXT" = TRUE

export const Indicator = ({value, name, measureUnit, floor, reference, fontSize, tolerance, allowText}) => {

	if (!allowText){
		tolerance = parseInt(tolerance)
		value = parseFloat(value)
		reference = parseInt(reference)
	}




	const valueArray = value.toString().split('.')
	console.log(`Value: ${value}, value array: ${valueArray}`)
	const integer = valueArray[0]
	let decimal = valueArray[1]?.substring(0, floor ?? 2)

	if (!decimal && floor){
		decimal = ''
		for (let i = 0; i < floor; i++){
			decimal += "0"
		}
	}else if (decimal?.length < floor){
		for (let i = 0; i < floor - decimal.length; i++){
			decimal += "0"
		}
	}


	console.log(`decimal: ${decimal}, integer: ${integer}`)

	const visibility = measureUnit ? 'visible' : 'invisible'

	let backgrounds = {
		good: 'bg-success text-white',
		bad: 'bg-danger text-white',
		neutral: ''
	}
	let additionalBackground = backgrounds.neutral

	if (reference) {
		if (value > reference + tolerance) {
			console.log(`yes`)
			additionalBackground = backgrounds.good
		} else if (value < reference - tolerance) {
			additionalBackground = backgrounds.bad
		}
	}

	return (
		<div className={"d-flex justify-content-center flex-column border border-dark rounded p-2 m-3 " + additionalBackground }>
			<div className={"w-100 d-flex justify-content-end " + visibility} style={{marginBottom: "-5px"}}>
				<div className={"badge bg-dark"}>{measureUnit ?? "sus"}</div>
			</div>
			<div className={"d-flex flex-wrap justify-content-center"}>
				<div className={'d-flex align-items-end'}>
					<div
						className={`display-1 text-center font-weight-bold`}
						style={{fontSize: `${fontSize}px`}}
					>{integer}</div>
					{decimal ? <div
						className={`display-1 text-center font-weight-bold`}
						style={{fontSize: `${(fontSize-20)}px`}}
					>.{decimal}</div> : <></>}
				</div>
			</div>
			<div className={"text-center"} style={{whiteSpace: 'nowrap'}}>
				{name}
			</div>
		</div>
	)
}
