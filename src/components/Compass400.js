import needle from '../data/media/Needle Silva.png';
import back from '../data/media/Back.png';

function Compass400(input) {
    const {needleId,compassTextId} = input.input
    return (
        <>
            <div className='compass'>
                <img src={back} alt="back" className='back' />
                <img src={needle} id={needleId} className='needle' alt="needle" />
                <br />
            </div>
            <span id={compassTextId} className='compassIndicator'>0</span>
        </>

    )
}
export default Compass400