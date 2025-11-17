

function tracksQta(c, tracksLength){
    let counter = 0;

    while(true){
        let tSpace = tracksLength*counter;
        if (tSpace > c) break;
        counter++;
    }

    return counter;
}


export default function (x1 ,y1, x2, y2, paper, tracks){

    let line = new paper.Path.Line({
        from: new paper.Point(x1, y1),
        to: new paper.Point(x2, y2),
        strokeColor: "white",
        strokeWidth: 0
    })

    let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    let points = [];

    /*let tracks = tracksQta(line.length, tracksLength);*/


    tracks++;

    let segmentLength = line.length/tracks;

    if (tracks > 0){
        for (let i = 1; i < tracks; i++){
            let currentSegLength = segmentLength*i;
            let newPoint = line.getPointAt(currentSegLength);
            if (newPoint !== null){
                points.push({
                    x: newPoint.x,
                    y: newPoint.y
                });
            }

        }
    }

    return {
        points: points,
        angle: angle
    };

}
