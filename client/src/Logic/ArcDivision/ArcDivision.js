

function tracksQta(c, tracksLength){
    let counter = 0;

    while(true){
        let tSpace = tracksLength*counter;
        if (tSpace > c) break;
        counter++;
    }

    return counter;
}


export default function (p1 ,p2, middle, paper, tracks){

    let arc = new paper.Path.Arc({
        from: p1,
        to: p2,
        through: middle
    });



    let points = [];
    let angles = [];

    /*let tracks = tracksQta(arc.length, tracksLength);*/
    tracks++;

    let segmentLength = arc.length/tracks;

    if (tracks > 0){
        for (let i = 1; i < tracks; i++){
            let currentSegLength = segmentLength*i;
            let newPoint = arc.getPointAt(currentSegLength);
            if (newPoint !== null){
                points.push({
                    x: newPoint.x,
                    y: newPoint.y
                });
            }
            let tangent = arc.getTangentAt(currentSegLength);

            let secondPoint = new paper.Point(newPoint.x + tangent.x*60, newPoint.y + tangent.y*60);



            let angle = Math.atan2(secondPoint.y - newPoint.y, secondPoint.x - newPoint.x) * 180 / Math.PI;


            angles.push(angle);
        }
    }


    return {
        points: points,
        angles: angles
    };

}
