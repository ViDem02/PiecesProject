import AbsoluteBox from "./AbsoluteBox/AbsoluteBox";
import paper from "paper";

export default class Relative {

    responsive;
    canvasX;

    constructor(absoluteBox, responsive, maxWidth, canvasX) {
        this.absoluteBox = absoluteBox;
        absoluteBox.setResponsive(responsive);
        this.responsive = responsive;
        this.maxWidth = maxWidth;
        this.canvasX = canvasX;
    }

    rW(px){
        let boxWidth = this.absoluteBox.bottomRight.x;
        let windowWidth = this.canvasX < this.maxWidth ? this.canvasX : this.maxWidth;
        if (this.responsive){
            return (px * windowWidth) / boxWidth;
        }
        return px;
    }


}
