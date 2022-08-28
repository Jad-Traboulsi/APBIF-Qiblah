import needle from '../data/media/Needle Silva.png';
import back from '../data/media/Back.png';
import configs from '../data/configs';
import '../styles/Compass400.css'
import { useContext, useEffect, useState } from 'react';
import { Compass400Context } from './Contexts';

function Compass400({ needleId, compassTextId, boxId, containerId, buttonId, bearing, declination }) {
    const [showCompass400] = useContext(Compass400Context)
    const [style,setStyle] = useState({
        display:"none"
    })

    useEffect(() => {
        if (showCompass400) {
            document.getElementById(boxId).style.display = "block";
            setTimeout(() => {
                document.getElementById(containerId).style.top = "0%";
                setTimeout(function () {
                    document.getElementById(needleId).style.transform = `rotate(${(360 - (bearing - Number(declination))).toFixed(configs.decimal)}deg)`;
                    document.getElementById(compassTextId).innerHTML = `${((360 - (bearing - Number(declination))) / 9).toFixed(1)}`;
                }, 550);
            }, 200)

        } else {
            document.getElementById(containerId).style.top = "-100%";
            document.getElementById(needleId).style.transform = "rotate(0deg)"
            document.getElementById(compassTextId).innerHTML = `0`;
            setTimeout(function () {
                document.getElementById(boxId).style.display = "none";
            }, 450);

        }
    }, [bearing, boxId, buttonId, compassTextId, containerId, declination, needleId, showCompass400])
    return (
        <div id={boxId}>
            <div id={containerId}>
                <img src={back} alt="back" id='compass400Back' />
                <img src={needle} id={needleId} alt="needle" />
                <br />
                <span id={compassTextId} className='compassIndicator'>0</span>
            </div>
        </div>

    )
}
export default Compass400