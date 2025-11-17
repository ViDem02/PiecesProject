import paper from 'paper';
import TrackColorSchemes from "./TrackColorSchemes"
import Train from "../Train/Train"
import CounterStore from "../../../Redux/Store/CounterStore";


export default class Track {
    group;
    center;
    rotation;
    width = 60;
    height = 60;
    angle;
    paper;

    bigRect;
    smallRect;

    colorScheme;

    paperID;

    fontSize;

    relative = CounterStore.getState().sketchRelative;

    trackWidth;


    constructor(twoExtremeResult, centerX, centerY, rotation, paperArg, colorScheme, paperID, fontSize, trackWidth) {

        this.trackWidth = trackWidth

        this.fontSize = fontSize ?? 30
        this.colorScheme = colorScheme;

        let x, y;
        if (twoExtremeResult !== null){
            /*x = this.r.rW(twoExtremeResult.center.x);
            y = this.r.rW(twoExtremeResult.center.y);
            this.rotation = twoExtremeResult.angle;*/
        }else{
            x = centerX;
            y = centerY;
            this.rotation = rotation;
        }

        this.paper = paperArg;
        if (this.paper === undefined) this.paper = paper;
        this.center = new paper.Point(x, y);
        this.paperID = paperID;
    }

    occupy(userOrder){
        this.drawEmpty();
        new Train(
            this.center,
            this.rotation,
            userOrder,
            this.colorScheme.name,
            this.paper
        ).draw();
    }


    drawEmpty(){

        if (this.group !== null && this.group !== undefined){
            this.group.remove();
        }

        const rW = (px) => {
            let r = px * 0.65;
            if (this.relative !== null){
                r = this.relative.rW(r);
            }
            return r;
        }

        this.bigRect = new this.paper.Path.Rectangle({
            center: this.center,
            size: new this.paper.Size(rW(this.width+10), rW(this.height+10)),
            radius: new this.paper.Size(rW(10), rW(10)),
            strokeColor: this.colorScheme.bigRect,
            strokeWidth: rW(2)
        });
        this.bigRect.dashArray = [10, 12];

        this.group = new this.paper.Group([
            this.bigRect,
        ]);

        if (this.rotation !== undefined) this.group.rotate(this.rotation, this.center);
    }


     draw() {

         if (this.group !== null && this.group !== undefined){
             this.group.remove();
         }

         const rW = (px) => {
             let r = px * 0.65;
             if (this.relative !== null){
                 r = this.relative.rW(r);
             }
             return r;
         }

         this.bigRect = new this.paper.Path.Rectangle({
             center: this.center,
             size: new this.paper.Size(rW(this.trackWidth), rW(this.height)),
             /*radius: new this.paper.Size(rW(10), rW(10)),*/
             fillColor: this.colorScheme.bigRect
         });

        /*this.smallRect = new this.paper.Path.Rectangle({
             center: this.center,
             size: new this.paper.Size(rW(50), rW(40)),
             radius: new this.paper.Size(rW(10), rW(10)),
             fillColor: this.colorScheme.smallRect
         });*/


         const text = new this.paper.PointText({
             point: new this.paper.Point(this.center.x, this.center.y+rW(this.fontSize / 2 - this.fontSize/6)),
             content: this.paperID,
             fillColor: this.colorScheme.text,
             fontFamily: 'Helvetica',
             fontWeight: 'normal',
             fontSize: rW(this.fontSize),
             justification: 'center',
         });



         this.group = new this.paper.Group([
              this.bigRect,
             this.smallRect,
             text,
         ]);

         if (this.rotation !== undefined) this.group.rotate(this.rotation, this.center);

    }

    rotate (angle) {

    }

    move (newCenterPoint){
        this.group.position = newCenterPoint;
    }

    erase(){
         this.group.remove();
    }

}
