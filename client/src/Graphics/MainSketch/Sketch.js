import React, {useEffect, useState} from 'react'
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
import {useDispatch, useSelector} from "react-redux"
import ArcDivision from "../../Logic/ArcDivision/ArcDivision"
import {setSketchRelative} from "../../Redux/Actions/CounterActions"
import useCurrentWidth from "../ResizeHook/useCurrentWidth"
import NetworkedComponent from "../Objects/NetworkedComponent/NetworkedComponent"
import {isArray} from "chart.js/helpers"

const debug = false





export const Sketch =  () => {

    let statusRes = useSelector(state => state.statusData.data)


    function getIp(deviceName){
        let ip = 'Local Network'
        if (isArray(statusRes)) {
            statusRes.forEach(s => {
                if (s.device === deviceName) {
                    if (s.ip) ip = s.ip
                }
            })
        }
        return ip
    }

    function getInvalid(deviceName){
        let invalid = true
        if (isArray(statusRes)) {
            statusRes.forEach(s => {
                if (s.device === deviceName) {
                    invalid = !s.status
                }
            })
        }
        return invalid
    }

    const [enable, setEnable] = useState(false);
    const gameMap = useSelector(state => state.map);
    const lineOccupy = useSelector(state => state.lineOccupy);
    const dispatch = useDispatch();

    let allComponents = [];

    let lines = [];
    let tracks = [];
    let cities = [];

    let canvasWidth = useCurrentWidth() * 0.7;


    let absoluteBox = new AbsoluteBox(new paper.Point(1200, 2000));
    let relative = new Relative(absoluteBox, !debug, 700, canvasWidth);
    dispatch(setSketchRelative(relative));



    console.log("Sketch painting... Canvas width: " + canvasWidth);

    const checkLicenced = (paperID) => {
        let userOrder = -1;
        if (lineOccupy !== null){
            lineOccupy.forEach(l => {
                if (l.paperID === paperID) userOrder = l.userOrder;
            })
        }
        return userOrder;
    }


    useEffect(() => {
        paper.install(window);
        paper.setup("paper-canvas");
        draw();

        paper.view.onMouseDown = function(event) {
            if (debug){
                new PxPointer(relative, relative.rW(event.point.x), relative.rW(event.point.y), "blue", paper).draw();
                alert(`x = ${event.point.x}  y = ${event.point.y}`);
            }
            //const pxP = new PxPointer(relative, relative.rW(event.point.x), relative.rW(event.point.y), "blue", paper);
            //pxP.draw();
            //SavePointToServer(event.point.x, event.point.y, "blue");
        }

        paper.view.draw();
        setEnable(true);
    }, []);

    useEffect(draw, [gameMap, enable, lineOccupy, canvasWidth, statusRes]);

    function onFrame(event) {
        // the number of times the frame event was fired:
        console.log(event.count);

        // The total amount of time passed since
        // the first frame event in seconds:
        console.log(event.time);

        // The time passed in seconds since the last frame event:
        console.log(event.delta);
    }

    function draw(event) {

        paper.project.clear();

        if (debug) absoluteBox.draw();




        let ard = new NetworkedComponent(
            new paper.Point({
                x: relative.rW(900),
                y: relative.rW(150),
            }),
            paper,
            'ARDUINO',
            '/dev/ARD_PORT_1',
            [ '#403B4A', '#E7E9BB'],
            '#020202',
            getInvalid('arduino')
        )

        let rpi = new NetworkedComponent(
            new paper.Point({
                x: relative.rW(250),
                y: relative.rW(500),
            }),
            paper,
            'RASP PI',
            getIp('raspberrypi'),
            [ '#4CB8C4', '#3CD3AD'],
            '#020202',
            getInvalid('raspberrypi')
        )

        let socketApi = new NetworkedComponent(
            new paper.Point({
                x: relative.rW(830),
                y: relative.rW(980),
            }),
            paper,
            'SOCKET API',
            'mat-pieces-socket\n.herokuapp.com',
            [ '#FF512F', '#DD2476'],
            '#020202',
            getInvalid('socket')
        )


        let client = new NetworkedComponent(
            new paper.Point({
                x: relative.rW(743),
                y: relative.rW(1627),
            }),
            paper,
            'REACT SERV',
            'mat-pieces-client\n.herokuapp.com',
            [ '#1FA2FF', '#12D8FA', '#A6FFCB'],
            '#020202',
        )


        let restApi = new NetworkedComponent(
            new paper.Point({
                x: relative.rW(200),
                y: relative.rW(1375),
            }),
            paper,
            'REST API',
            'mat-pieces-server\n.herokuapp.com',
            [ '#E55D87', '#5FC3E4'],
            '#020202',
            getInvalid('restapi')
        )

        let mongoDb = new NetworkedComponent(
            new paper.Point({
                x: relative.rW(360),
                y: relative.rW(912),
            }),
            paper,
            'MONGO DB',
            'MongoDB Atlas',
            [ 'rgb(1,193,98)', 'rgb(0,136,75)'],
            '#020202',
            getInvalid('database')
        )

        let auth = new NetworkedComponent(
            new paper.Point({
                x: relative.rW(240),
                y: relative.rW(1873),
            }),
            paper,
            'AUTH',
            'mat-pieces-auth\n.herokuapp.com',
            [ '#e65c00', '#F9D423'],
            '#020202',
            getInvalid('auth')
        )



        new AutomaticArch(
            restApi.rightPoint,
            socketApi.center,
            new paper.Point({
                x: relative.rW(697),
                y: relative.rW(1336)
            }),
            paper,
            ['SOCKET'],
            TrackColorSchemes.black,
            50,
            230
        ).draw()


        new AutomaticArch(
            mongoDb.rightPoint,
            restApi.rightPoint,
            new paper.Point({
                x: relative.rW(519),
                y: relative.rW(1168)
            }),
            paper,
            ['MDB WIRE PR'],
            TrackColorSchemes.black,
            50,
            350
        ).draw()


        new AutomaticArch(
            rpi.center,
            ard.center,
            new paper.Point({
                x: relative.rW(403.25),
                y: relative.rW(216.625)
            }),
            paper,
            ['SERIAL'],
            TrackColorSchemes.black,
            50,
            190
        ).draw()


        new AutomaticArch(
            rpi.center,
            restApi.center,
            new paper.Point({
                x: relative.rW(49),
                y: relative.rW(940)
            }),
            paper,
            ['HTTPS'],
            TrackColorSchemes.black,
            50,
            190
        ).draw()

        new AutomaticArch(
            rpi.center,
            new paper.Point({
                x: relative.rW(917),
                y: relative.rW(978)
            }),
            new paper.Point({
                x: relative.rW(701),
                y: relative.rW(609)
            }),
            paper,
            ['SOCKET'],
            TrackColorSchemes.black,
            50,
            230
        ).draw()

        new AutomaticArch(
            restApi.center,
            client.center,
            new paper.Point({
                x: relative.rW(413),
                y: relative.rW(1671)
            }),
            paper,
            ['HTTPS'],
            TrackColorSchemes.black,
            50,
            190
        ).draw()

        new AutomaticArch(
            new paper.Point({
                x: relative.rW(917),
                y: relative.rW(978)
            }),
            client.center,
            new paper.Point({
                x: relative.rW(912),
                y: relative.rW(1424)
            }),
            paper,
            ['SOCKET'],
            TrackColorSchemes.black,
            50,
            230
        ).draw()

        new AutomaticArch(
            auth.center,
            restApi.center,
            new paper.Point({
                x: relative.rW(113),
                y: relative.rW(1616)
            }),
            paper,
            ['HTTPS'],
            TrackColorSchemes.black,
            50,
            190
        ).draw()

        new AutomaticArch(
            client.center,
            auth.rightPoint,
            new paper.Point({
                x: relative.rW(595),
                y: relative.rW(1882)
            }),
            paper,
            ['HTTPS'],
            TrackColorSchemes.black,
            50,
            190
        ).draw()

        new AutomaticArch(
            new paper.Point({
                x: auth.rightPoint.x,
                y: auth.rightPoint.y + relative.rW(40)
            }),
            socketApi.rightPoint,
            new paper.Point({
                x: relative.rW(1059),
                y: relative.rW(1700)
            }),
            paper,
            ['SOCKET'],
            TrackColorSchemes.black,
            50,
            230
        ).draw()



        ard.draw()
        rpi.draw()
        restApi.draw()
        socketApi.draw()
        client.draw()
        mongoDb.draw()
        auth.draw()



    }

    return (
        <></>
    );
}
