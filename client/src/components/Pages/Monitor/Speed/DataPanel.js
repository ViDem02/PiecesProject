import React, {useState} from 'react'
import {Indicator} from "./Indicator"
import {DataGroup} from "./DataGroup"
import {Clock} from "../../../Generic/Clock"

export const DataPanel = ({socketData, shiftVisualization}) => {

	const [fontSize, setFontSize] = useState(80)
	const [tolerance, setTolerance] = useState(1)

	const handleClick = (ticks) => {
		if (fontSize+ticks <= 80 && fontSize+ticks >= 30 ) setFontSize(fontSize+ticks)
	}

	const handleTolChange = (value) => {
		console.log(`Setting tolerance to ${value}`)
		setTolerance(value)
	}

	console.log(`Socket data: ${JSON.stringify(socketData)}!`)

	return (
		<React.Fragment>
			<div className={"w-100 h-100"}>
				{
					!shiftVisualization ?
					<DataGroup title={"Controlli testo"}>
						<button className={"btn btn-primary m-2"} onClick={() => handleClick(20)}>Aumenta carattere
						</button>
						<button className={"btn btn-primary m-2"} onClick={() => handleClick(-20)}>Diminuisci
							carattere
						</button>
						<div className="input-group m-2 w-25">
							<span className="input-group-text" id="basic-addon3">Tolleranza</span>
							<input type="text" value={tolerance} onChange={e => handleTolChange(e.target.value)}
							       className="form-control" id="basic-url" aria-describedby="basic-addon3"/>
						</div>
					</DataGroup>
						:
						<div className={"mt-4 h2 w-100 text-center"}>
						</div>
				}
				<DataGroup title={"Dati Generali"}>
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Commessa"} value={socketData.order ?? "--"} allowText={true}/>
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Modello"} value={socketData.model ?? "--"} allowText={true}/>
				</DataGroup>
				<DataGroup title={"Pezzi"}>
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Prodotti"} value={socketData.sum} floor={0} measureUnit={"pcs"}/>
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Da Produrre"} value={socketData.totPieces - socketData.sum} floor={0}  measureUnit={"pcs"}/>
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Richiesti"} value={socketData.totPieces} floor={0} measureUnit={"pcs"}/>
				</DataGroup>
				<DataGroup title={"Velocità"} last={true}>
					{
						shiftVisualization ? <></> :
						<Indicator tolerance={tolerance} fontSize={fontSize} name={"All'istante"}
						           value={socketData.last} floor={2} measureUnit={"pezzi/min"}
						           reference={socketData.avg}/>
					}
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Massima"}            value={socketData.max}  floor={2} measureUnit={"pezzi/min"}/>
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Minima"}            value={socketData.min}  floor={2} measureUnit={"pezzi/min"}/>
					<Indicator  tolerance={tolerance} fontSize={fontSize}   name={"Media nella lavorazione"}    value={socketData.avg}  floor={2} measureUnit={"pezzi/min"}/>
				</DataGroup>
			</div>
		</React.Fragment>
	)
}
