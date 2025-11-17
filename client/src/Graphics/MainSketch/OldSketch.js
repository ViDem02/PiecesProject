import React from 'react';
import paper from "paper";

import Train from '../Objects/Train/Train';
import AbsoluteBox from "../../Logic/RelativeCalculation/AbsoluteBox/AbsoluteBox"
import Relative from "../../Logic/RelativeCalculation/Relative"
import City from "../Objects/City/City"
import Track from "../Objects/Track/Track"
import PxPointer from "../Objects/PxPointer/PxPointer"
import TwoExtremes from "../../Logic/AngleCalculation/TwoExtremes/TwoExtremes"
import PointsFromServer from "../Groups/Points/PointsFromServer"
import SavePointToServer from "../../Logic/PointsGroup/SavePointToServer"
import AutomaticLine from "../Groups/AutomaticLine/AutomaticLine"
import AutomaticArch from "../Groups/AutomaticArch/AutomaticArch"
import TrainColorSchemes from "../Objects/Train/TrainColorSchemes"
import TrackColorSchemes from "../Objects/Track/TrackColorSchemes"


export default () => {


    let absoluteBox = new AbsoluteBox(new paper.Point(1000, 1000));
    let relative = new Relative(absoluteBox, true, 1000);
    let train = new Train(relative, 100, 100, 0, 5, TrainColorSchemes.black);
    let city = new City(relative, 127, 548, "New York");
    let track = new Track(relative, null, 500, 500, 0, paper, TrackColorSchemes.black);

    window.onload = () => {
        paper.install(window);
        paper.setup("paper-canvas");
        draw();

        var myPath;

        paper.view.onMouseDown = function(event) {
            alert("Event X = " + event.point.x + " Event Y = " + event.point.y);
            const pxP = new PxPointer(relative, relative.rW(event.point.x), relative.rW(event.point.y), "blue", paper);
            pxP.draw();
            //SavePointToServer(event.point.x, event.point.y, "blue");
        }

        paper.view.onMouseDrag = function(event) {
        }

        paper.view.onMouseUp = function(event) {
        }

        paper.view.draw();
    };

    function draw(event) {
        train.draw();
        city.draw();
        absoluteBox.draw();
        train.setToTrack(track);
        //PointsFromServer(paper, relative);
        let automaticLine = new AutomaticLine(127, 548, 366, 10, paper, relative, track.width+20, TrackColorSchemes.blue).draw();
        //new AutomaticLine(307, 720, 739, 731, paper, relative, track.width+20).draw();
        new AutomaticLine(127, 548, 307, 720, paper, relative, track.width+20, TrackColorSchemes.red).draw();
        //new AutomaticLine(366, 10, 679, 246, paper, relative, track.width+20).draw();
        new AutomaticArch(new paper.Point(366, 10), new paper.Point(679, 246), new paper.Point(584, 81), paper, relative, track.width+20, TrackColorSchemes.blue).draw()
        new AutomaticArch(new paper.Point(679, 246), new paper.Point(307, 720),new paper.Point(594, 580), paper, relative, track.width+20, TrackColorSchemes.green ).draw()
        new AutomaticArch(new paper.Point(739, 731), new paper.Point(307, 720), new paper.Point(522, 826), paper, relative, track.width+20, TrackColorSchemes.orange ).draw()
        new AutomaticArch(new paper.Point(679, 246), new paper.Point(739, 731), new paper.Point(873, 492), paper, relative, track.width+20, TrackColorSchemes.black).draw()
        new AutomaticArch(new paper.Point(379, 246), new paper.Point(1239, 731), new paper.Point(873, 492), paper, relative, track.width+20, TrackColorSchemes.black).draw()

    }

    // Most return null
    return (
        <></>
    );
}
