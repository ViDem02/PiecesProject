function radians_to_degrees(radians)
{
    let pi = Math.PI;
    return radians * (180/pi);
}

export default function (x1 ,y1, x2, y2){
    let a = y2 + y1;
    let b = x1 + x2;

    let c = Math.sqrt(Math.pow(a, 2)+Math.pow(b, 2));

    let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;


    let xCenter = (x1 + x2)/2;
    let yCenter = (y1 + y2)/2;

    const result = {
        angle: angle,
        center: {
            x : xCenter,
            y : yCenter
        },
        triangle: {
            a: a,
            b: b,
            c: c
        }
    }

    console.log(JSON.stringify(result));

    return result;
}
