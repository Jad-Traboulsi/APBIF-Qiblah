import needle from '../data/media/Needle Silva.png';
import back from '../data/media/Back.png';

function Compass400({ needleId, compassTextId, boxId, containerId, clicked }) {
    console.log(clicked);
    return (
        <div id={boxId}>
            <div id={containerId}>
                    <img src={back} alt="back" id='compass400Back' />
                    <img src={needle} id={needleId} alt="needle" />
                    <br />
                <span id={compassTextId} className='compassIndicator'>0</span>
                {clicked.compass400 && (<>clicked</>)}
            </div>
        </div>

    )
}
export default Compass400