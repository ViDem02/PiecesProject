import React from 'react'
import PxPointer from "../../Objects/PxPointer/PxPointer"
import LineDivision from "../../../Logic/LineDivision/LineDivision"
import Track from "../../Objects/Track/Track"
import paper from "paper"

export default class AutomaticLine {

    p1;
    p2;
    paper;
    group;

    lineDivision;
    colorScheme;

    paperID;

    tracksIDs;

    tracks = [];




    occupy(userOrder){
        if (this.tracks !== []){
            this.tracks.forEach(t => {
                t.occupy(userOrder)
            });
        }
    }

    constructor (x1, y1, x2, y2, paper, tracksIDs, colorScheme, paperID){
        this.colorScheme = colorScheme;
        this.paper = paper;
        this.p1 = new this.paper.Point(x1, y1);
        this.p2 = new this.paper.Point(x2, y2);

        this.lineDivision = LineDivision(x1, y1, x2, y2, paper, tracksIDs.length);

        this.paperID = paperID;
        this.tracksIDs = tracksIDs;
    }

    draw(){

        if (this.group !== null && this.group !== undefined){
            this.group.remove();
        }

        if (this.lineDivision.points.length < 3 || this.lineDivision.points.length > 6){
            const line = new this.paper.Path.Line({
                from: this.p1,
                to: this.p2,
                strokeColor: "red",
                strokeWidth: 5
            });
            const text = new paper.PointText({
                point: new this.paper.Point(this.p1.x, this.p1.y-10),
                content: "LINE NOT VALID! VAGONS = " + this.lineDivision.points.length,
                fillColor: 'RED',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fontSize: 15,
                justification: 'left'
            });
            text.rotate(this.lineDivision.angle, this.p1);
            return
        }

        const line = new this.paper.Path.Line({
            from: this.p1,
            to: this.p2,
            strokeColor: "red",
            strokeWidth: 0
        });

        this.lineDivision.points.forEach((p,index)=> {
            this.tracks.push(new Track(
                null,
                p.x,
                p.y,
                this.lineDivision.angle,
                this.paper,
                this.colorScheme,
                this.tracksIDs[index])
            );
        })

        this.tracks.forEach(t => t.draw(this.paper));



        this.group = new this.paper.Group([
            line
        ]);


    }

}
