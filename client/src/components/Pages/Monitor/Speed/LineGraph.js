import React from 'react'
import {Line} from 'react-chartjs-2'



export const LineGraph = ({values: propsValues, max, min}) => {

	const options = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
						stepSize: 1,
					},
					min: (min -2),
					max : (max + 2),
				},
			],
		},
		animation: {
			duration: 0
		}
	}

	let values = propsValues.slice(-(Math.min(propsValues.length, 9)))

	if (!values) {
		return (
			<div>Non ci sono ancora dati!</div>
		)
	}

	let labels = []

	for (let i = 0; i < 9; i++) {
		labels.push(`${8-i}`)
	}

	const data = {
		labels,
		datasets: [{
			label: 'Speeds recorded',
			data: values,
			fill: true,
			pointBackgroundColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255,99,132,0.2)',
			borderColor: 'rgba(255, 99, 132, 0.2)',
			lineTension: 0,
			fillColor: 'rgb(255,255,255)'
		},],
	}

	return (
		<React.Fragment>
			<div className="w-100 text-center"><h1 className="title">Graph</h1>
			</div>
			<Line data={data} options={options}/>
		</React.Fragment>
	)
}
