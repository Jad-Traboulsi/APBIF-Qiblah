import needle from '../data/media/Needle Silva.png';
import back from '../data/media/Back.png';
import configs from '../data/configs';
import '../styles/Compass400.css'
import { useContext, useEffect, useState } from 'react';
import { Compass400Context } from './Contexts';

function Compass400({ bearing, declination }) {
    const [showCompass400] = useContext(Compass400Context)
    const [display,setDisplay] = useState("none")
    const [containerTop, setContainerTop] = useState('0%')
    const [angle,setAngle] = useState(0)


    useEffect(() => {
        console.log(Number(((360 - (bearing - Number(declination))) / 0.9).toFixed(configs.decimal)));
        if (showCompass400) {
            setDisplay('block')
            setTimeout(() => {
                setContainerTop('0%');
                setTimeout(function () {
                    setAngle(Number(((360 - (bearing - Number(declination))) / 0.9).toFixed(configs.decimal)));
                }, 550);
            }, 200)

        } else {
            setContainerTop('-100%')
            setAngle(0);
            setTimeout(function () {
                setDisplay('none')
            }, 450);

        }
    }, [bearing, setDisplay,setAngle, setContainerTop, declination, showCompass400])
    return (
        <div id='compass400Box' style={{display:display}}>
            <div id='compass400Container' style={{top:containerTop}}>
                <img src={back} alt="back" id='compass400Back' />
                <img src={needle} id='compass400Needle' alt="needle" style={{transform:`rotate(${angle}grad)`}}/>
                <br />
                <span id='compass400Text' className='compassIndicator'>{(angle/10).toFixed(1)}</span>
            </div>
        </div>

    )
}
export default Compass400