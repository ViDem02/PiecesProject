import TrackColorSchemes from "../Track/TrackColorSchemes"
import TrainColorSchemes from "./TrainColorSchemes"
import CounterStore from '../../../Redux/Store/CounterStore';

export default class Train {
    r = CounterStore.getState().sketchRelative;
    group;
    rotation;
    playerNumber;
    colorScheme;
    paper;

    constructor(center, rotation, playerNumber, colorScheme, paper) {
        this.paper = paper;
        this.center = center;
        this.rotation = rotation;
        this.playerNumber = playerNumber;

        TrainColorSchemes.forEach(c => {
            if (c.name === colorScheme)this.colorScheme = c;
        });
    }


    setToTrack(track){
        track.drawEmpty();
        this.rotation = track.rotation;
        this.center = track.center;
        if (this.group !== undefined ) this.group.remove();
        this.draw();
    }


     draw(event) {

         if (this.group !== null && this.group !== undefined){
             this.group.remove();
         }

         const rW = (px) => {
             let r = px * 0.65;
             if (this.r !== null){
                 r = this.r.rW(r);
             }
             return r;
         }

         const bigRect = new this.paper.Path.Rectangle({
             center: this.center,
             size: new this.paper.Size(rW(50), rW(40)),
             radius: new this.paper.Size(rW(10), rW(10)),
             fillColor: this.colorScheme.bigRect
         });

         const smallRect = new this.paper.Path.Rectangle({
             center: this.center,
             size: new this.paper.Size(rW(80), rW(20)),
             radius: new this.paper.Size(rW(10), rW(10)),
             fillColor: this.colorScheme.smallRect
         });

         const leftScrew = new this.paper.Path.Circle({
             center: new this.paper.Point(this.center.x - rW(20), this.center.y),
             radius: rW(5),
             fillColor: this.colorScheme.screws
         });

         const rightScrew =  new this.paper.Path.Circle({
             center: new this.paper.Point(this.center.x + rW(20), this.center.y),
             radius: rW(5),
             fillColor: this.colorScheme.screws
         });

         const text = new this.paper.PointText({
             point: new this.paper.Point(this.center.x, this.center.y+rW(5)),
             content: this.playerNumber,
             fillColor: this.colorScheme.text,
             fontFamily: 'Arial',
             fontWeight: 'bold',
             fontSize: rW(20),
             justification: 'center',
         });

         text.rotate(90, this.center)

         this.group = new this.paper.Group([
             bigRect,
             smallRect,
             leftScrew,
             rightScrew,
             text
         ]);

         if (this.rotation !== undefined) this.rotate(this.rotation);
    }

    rotate (angle) {
        this.group.rotate(angle, this.center);
    }

    move (newCenterPoint){
        this.group.position = newCenterPoint;
    }

    erase(){
         this.group.remove();
    }

}
