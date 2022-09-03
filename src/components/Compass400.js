import needle from '../data/media/Needle Silva.png';
import back from '../data/media/Back.png';
import configs from '../data/configs';
import '../styles/Compass400.css'
import { useContext, useEffect, useRef, useState } from 'react';
import { Compass400Context } from './Contexts';

function Compass400({ bearing, declination, location }) {
    const canvasRef = useRef(null)
    const [showCompass400] = useContext(Compass400Context)
    const [display, setDisplay] = useState("none")
    const [containerTop, setContainerTop] = useState('-100%')
    // const [angle,setAngle] = useState(0)
    console.log(location);

    useEffect(() => {
        
        if (showCompass400) {
            setDisplay('block')
            setTimeout(() => {
                setContainerTop('0%');
                // setTimeout(function () {
                //     setAngle(Number(((360 - (bearing - Number(declination))) / 0.9).toFixed(configs.decimal)));
                // }, 550);
            }, 200)

        } else {
            setContainerTop('-100%')
            // setAngle(0);
            setTimeout(function () {
                setDisplay('none')
            }, 450);

        }

        function gradToRad(x){
            return x*Math.PI/200;
        }
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,canvas.width,canvas.height)
        var imgFront = new Image();
        var imgBack = new Image();
        function drawBack() {
            const oc = document.createElement('canvas');
            const octx = oc.getContext('2d');

            oc.width = imgBack.width;
            oc.height = imgBack.height;

            octx.drawImage(imgBack, 0, 0, oc.width, oc.height);

            ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, canvas.width, canvas.width);
            imgFront.src = needle;
        }
        imgBack.onload = drawBack
        imgFront.onload = function () {
            const iw = 15;
            const ih = 204;
            const needleXOffset = 67;
            const needleYOffset = 89;
            const oc = document.createElement('canvas');
            const octx = oc.getContext('2d');
            oc.width = 205;
            oc.height = 205;
            octx.translate(oc.width / 2, oc.height / 2); //let's translate
            const angle = ((360 - (bearing - Number(declination))) / 0.9)
            octx.rotate(gradToRad(angle));
            octx.translate(-(oc.width / 2), -(oc.height / 2)); //let's translate
            octx.drawImage(imgFront, oc.width / 2 - iw / 2, oc.height / 2 - ih / 2, iw, ih);
            
            ctx.save();
            ctx.drawImage(oc, 0, 0, oc.width, oc.height, needleXOffset, needleYOffset, oc.width, oc.height);
            ctx.restore();
            ctx.font = '30px serif';
            ctx.textAlign = 'center';
            ctx.fillRect(0, canvas.height - 70,canvas.width,canvas.height)

            ctx.fillStyle = 'black'
            ctx.fillText(location.town ? location.town : location.city ? location.city : location.municipality ? location.municipality : ""
                , canvas.width / 2, canvas.height - 40)
            ctx.fillText((Number(((360 - (bearing - Number(declination))) / 0.9).toFixed(configs.decimal)) / 10).toFixed(1), canvas.width / 2, canvas.height-10)


        }
        imgBack.src = back;

    }, [bearing, setDisplay, setContainerTop,location, declination, showCompass400])
    return (
        <div id='compass400Box' style={{ display: display }}>
            <div id='compass400Container' style={{ top: containerTop }}>
                <canvas id="compass400" width={340} height={420} ref={canvasRef} />
                {/* <img src={back} alt="back" id='compass400Back' />
                <img src={needle} id='compass400Needle' alt="needle" style={{ transform: `rotate(${angle}grad)` }} />
                <br />
                <span id='compass400Text' className='compassIndicator'>
                    {location.town ? location.town : location.city ? location.city : location.municipality ? location.municipality : ""}
                    <br />
                    {(Number(((360 - (bearing - Number(declination))) / 0.9).toFixed(configs.decimal)) / 10).toFixed(1)}
                </span> */}
            </div>
        </div>

    )
}
export default Compass400