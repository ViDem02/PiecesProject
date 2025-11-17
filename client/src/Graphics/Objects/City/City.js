import CounterStore from "../../../Redux/Store/CounterStore"


export default class City {
    group;
    name;
    paperID;
    paper;
    center;

    relative = CounterStore.getState().sketchRelative;

    constructor(centerPoint,  name, paperID, paper) {
        this.paper = paper;
        this.center = centerPoint;
        this.name = name;
        this.paperID = paperID;
    }




    draw(event) {

        if (this.group !== null && this.group !== undefined){
            this.group.remove();
        }

        if (this.paper === undefined) return;

        const rW = (px) => {
            let r = px;
            if (this.relative !== null){
                r = this.relative.rW(r);
            }
            return r;
        }

        const mainPoint =  new this.paper.Path.Circle({
            center: this.center,
            radius: rW(10),
            fillColor: "white"
        });

        const text = new this.paper.PointText({
            point: new this.paper.Point(this.center.x, this.center.y+rW(30)),
            content: this.name,
            fillColor: 'white',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: rW(15),
            justification: 'center'
        });

        this.group = new this.paper.Group([
            mainPoint,
            text
        ]);

    }

    rotate (angle) {
        this.group.rotate(90, this.center);
    }

    move (newCenterPoint){
        this.group.position = newCenterPoint;
    }

    erase(){
        this.group.remove();
    }

}
