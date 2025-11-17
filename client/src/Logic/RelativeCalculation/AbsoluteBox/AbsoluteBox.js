import paper from "paper";


export default class Box {
    topLeft = new paper.Point(0, 0);
    bottomRight = new paper.Point(1000, 1000);
    responsive;
    group;

    constructor(bottomRightPoint) {
        this.bottomRight = bottomRightPoint;
    }

    setResponsive(responsive){
        this.responsive = responsive;
    }

     draw() {

         const bigRect = new paper.Path.Rectangle({
             from: this.topLeft,
             to: this.bottomRight,
             strokeColor: this.responsive ? "green" : "red",
             strokeWidth:10
         });

         if (this.responsive){
             console.log("Written!");
             const text = new paper.PointText({
                 point: new paper.Point(this.bottomRight.x-20, this.bottomRight.y-20),
                 content: 'Warning! Responsive',
                 fontFamily: 'Arial',
                 fontWeight: 'bold',
                 fillColor: 'white',
                 fontSize: 30,
                 justification: 'right'
             });
             this.group = new paper.Group([
                 bigRect,
                 text
             ]);
         }

         this.group = new paper.Group([
             bigRect
         ]);

    }
}
