/*import axios from 'axios';
import PxPointer from "../../Objects/PxPointer/PxPointer"

export default (paper, relative) => {

    axios.get("http://localhost:63343/PhpProjects/Materiale%20Bidinost/ticketgame/readPoints.php")
        .then(response => {
            console.log(response.data);

            response.data.forEach(e => {
                new PxPointer(relative, e.x, e.y, e.color, paper).draw();
            })
        })

}
*/
