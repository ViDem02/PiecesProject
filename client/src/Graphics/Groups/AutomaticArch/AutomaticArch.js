import React from 'react'
import PxPointer from "../../Objects/PxPointer/PxPointer"
import LineDivision from "../../../Logic/LineDivision/LineDivision"
import Track from "../../Objects/Track/Track"
import ArcDivision from "../../../Logic/ArcDivision/ArcDivision"
import CounterStore from "../../../Redux/Store/CounterStore"


export default class AutomaticArch {

    p1;
    p2;
    middle;
    paper;
    group;

    firstPxPointer;
    secondPxPointer;

    arcDivision;
    colorScheme;

    paperID;

    tracksIDs;

    tracks = [];

    fontSize;

    trackWidth;

    relative = CounterStore.getState().sketchRelative;

    constructor (p1, p2, middle, paper, tracksIDs, colorScheme, fontSize, trackWidth){

        this.trackWidth = trackWidth;
        this.fontSize = fontSize;
        this.paper = paper;
        this.p1 = p1;
        this.p2 = p2;
        this.middle = middle;

        this.arcDivision = ArcDivision(p1, p2, middle, paper, tracksIDs.length);
        this.colorScheme = colorScheme;

        this.paperID = 'paperID';
        this.tracksIDs = tracksIDs;

        this.tracks = [];
    }

    occupy(userOrder){
        if (this.tracks !== []){
            this.tracks.forEach(t => {
               t.occupy(userOrder)
            });
        }
    }

    draw(){


        const rW = (px) => {
            let r = px;
            if (this.relative !== null){
                r = this.relative.rW(r);
            }
            return r;
        }

        if (this.group !== null && this.group !== undefined){
            this.group.remove();
        }

        /*if (this.arcDivision.points.length < 3 || this.arcDivision.points.length > 6){
            const line = new this.paper.Path.Line({
                from: this.p1,
                to: this.p2,
                strokeColor: "red",
                strokeWidth: 10
            });
            const text = new this.paper.PointText({
                point: new this.paper.Point(this.p1.x, this.p1.y-10),
                content: "LINE NOT VALID! VAGONS = " + this.arcDivision.points.length,
                fillColor: 'RED',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fontSize: 15,
                justification: 'left'
            });
            text.rotate(this.arcDivision.angles[0], this.p1);
            return
        }*/

        const line = new this.paper.Path.Arc({
            from: this.p1,
            to: this.p2,
            through: this.middle,
            strokeColor: this.colorScheme.line,
            strokeWidth: rW(10)
        });

        this.arcDivision.points.forEach((p, index) => {
            this.tracks.push(new Track(
                null,
                p.x,
                p.y,
                this.arcDivision.angles[index],
                this.paper,
                this.colorScheme,
                this.tracksIDs[index],
                this.fontSize,
                this.trackWidth
            ));
        })

        this.tracks.forEach(t => t.draw(this.paper));



        this.group = new this.paper.Group();

        /*this.tracks.forEach(p => {
            this.group.addChild(p)
        })*/

    }

}
