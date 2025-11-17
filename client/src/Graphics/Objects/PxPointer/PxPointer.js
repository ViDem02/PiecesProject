export default class City {
    r;
    group;
    color;
    paper;

    constructor(relative, centerX, centerY, color, paper) {
        this.r = relative;
        this.color = color;
        let x = this.r.rW(centerX);
        let y = this.r.rW(centerY);
        this.paper = paper;
        this.center = new this.paper.Point(x, y);
    }




    draw(event) {

        const rW = (px) => {
            return this.r.rW(px);
        }

        const mainPoint =  new this.paper.Path.Circle({
            center: this.center,
            radius: rW(3),
            fillColor: this.color
        });

        const text = new this.paper.PointText({
            point: new this.paper.Point(this.center.x, this.center.y+30),
            content: '(' + this.center.x.toFixed(1) + ";" + this.center.y.toFixed(1) + ")",
            fillColor: 'green',
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
