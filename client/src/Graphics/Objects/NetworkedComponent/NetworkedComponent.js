import CounterStore from "../../../Redux/Store/CounterStore"


export default class NetworkedComponent {
    group;
    name;
    paperID;
    paper;
    _center;
    address;
    color;
    rect;
    gradientStops;
    foreColor;

    topPoint;
    leftPoint;
    rightPoint;
    bottomPoint;

    inactive;

    relative = CounterStore.getState().sketchRelative;

    rW(px) {
        let r = px;
        if (this.relative !== null){
            r = this.relative.rW(r);
        }
        return r;
    }

    constructor(centerPoint, paper, name, address, gradientStops, foreColor, inactive) {
        this.inactive = inactive;
        this.paper = paper;
        this._center = centerPoint;
        this.name = name;
        this.address = address;
        this.gradientStops = gradientStops;
        this.foreColor = foreColor;

        if (inactive){
            this.gradientStops = ['#bdc3c7','#bdc3c7']
        }


        const padding = 20;

        this._topPoint = new this.paper.Point(
            this._center.x,
            this._center.y - this.rW(100-padding)
        )


        this._leftPoint = new this.paper.Point(
            this._center.x - this.rW(150-padding),
            this._center.y
        )

        this._rightPoint = new this.paper.Point(
            this._center.x + this.rW(150-padding),
            this._center.y
        )

        this._bottomPoint = new this.paper.Point(
            this._center.x,
            this._center.y + this.rW(100-padding)
        )


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


        const rect = new this.paper.Path.Rectangle({
            center: this._center,
            size: new this.paper.Size(rW(300), rW(200)),
            radius: new this.paper.Size(rW(10), rW(10)),
            fillColor: {
                gradient: {
                    stops: this.gradientStops
                },
                origin: new this.paper.Point(this._center.x - rW(150), this._center.y - rW(100)),
                destination: new this.paper.Point(this._center.x + rW(150), this._center.y + rW(100)),
            },
            strokeWidth: rW(5),
            strokeColor: this.inactive ? '#e80000' : 'transparent',
            dashArray: [20, 30],
        });

        const text = new this.paper.PointText({
            point: new this.paper.Point(this._center.x, this._center.y-rW(25)),
            content: this.name,
            fillColor: this.inactive ? '#585757' : this.foreColor ?? 'white',
            fontFamily: 'Helvetica',
            fontWeight: 'bold',
            fontSize: rW(40),
            justification: 'center',
        });

        const address = new this.paper.PointText({
            point: new this.paper.Point(this._center.x, this._center.y+rW(30)),
            content: this.inactive ? `Non disponibile` : this.address,
            fillColor: this.inactive ? '#585757' : this.foreColor ?? 'white',
            fontFamily: 'Helvetica',
            fontWeight: 'normal',
            fontSize: rW(20),
            justification: 'center'
        });


        const mainPoint =  new this.paper.Path.Circle({
            center: this._topPoint,
            radius: rW(10),
            fillColor: "red"
        });

        const mainPoint2 =  new this.paper.Path.Circle({
            center: this._rightPoint,
            radius: rW(10),
            fillColor: "red"
        });

        const mainPoint3 =  new this.paper.Path.Circle({
            center: this._leftPoint,
            radius: rW(10),
            fillColor: "red"
        });

        const mainPoint4 =  new this.paper.Path.Circle({
            center: this._bottomPoint,
            radius: rW(10),
            fillColor: "red"
        });


        this.group = new this.paper.Group([
            mainPoint,
            mainPoint2,
            mainPoint3,
            mainPoint4,
            rect,
            address,
            text,
        ]);

    }

    rotate (angle) {
        this.group.rotate(90, this._center);
    }

    move (newCenterPoint){
        this.group.position = newCenterPoint;
    }


    get topPoint() {
        return this._topPoint
    }

    get leftPoint() {
        return this._leftPoint
    }

    get rightPoint() {
        return this._rightPoint
    }

    get bottomPoint() {
        return this._bottomPoint
    }


    get center() {
        return this._center
    }

    erase(){
        this.group.remove();
    }

}
