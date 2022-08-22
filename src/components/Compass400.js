import needle from '../data/media/Needle Silva.png';
import back from '../data/media/Back.png';

function Compass400(input) {
    const {needleId,compassTextId} = input.input
    return (
        <>
            <div id='compass400'>
                <img src={back} alt="back" id='compass400Back' />
                <img src={needle} id={needleId} alt="needle" />
                <br />
            </div>
            <span id={compassTextId} className='compassIndicator'>0</span>
        </>

    )
}
export default Compass400