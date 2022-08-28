import React, { useRef, useEffect, useState, useContext } from 'react'
import { CompassPhoneContext } from './Contexts';
import '../styles/CompassPhone.css'

const CompassPhone = ({angle}) => {
    const canvasRef = useRef(null)
    const [allAngles, setAllAngles] = useState(0);
    const [desiredAngle, setDesiredAngle] = useState(0);
    const [display, setDisplay] = useState("none");
    const [top, setTop] = useState("-100%");
    const [showCompassPhone] = useContext(CompassPhoneContext)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const canvasWidth = ctx.canvas.width
        const canvasHeight = ctx.canvas.height - 100
        const start = 90;
        

        //background
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight + 100)
        const getCoords = (x1, y1, x2, y2, angle) => {
            angle = angle * Math.PI / 180
            const xf = x2 + (x1 - x2) * Math.cos(angle) + (y1 - y2) * Math.sin(angle)
            const yf = x2 + (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle)
            return { x: xf, y: yf }
        }
        const rotateLine = (x1, y1, x2, y2, angle, width) => {
            const { x, y } = getCoords(x1, y1, x2, y2, angle)
            ctx.strokeStyle = 'white'
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
        }
        const rotateArrow = (x1, y1, x2, y2, angle) => {
            const p1 = getCoords(x1, y1-12, x2, y2, angle)
            const p2 = getCoords(x1 , y1, x2, y2, angle-3)
            const p3 = getCoords(x1, y1, x2, y2, angle+3)
            ctx.fillStyle = 'red'
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fill();
        }
        const rotateText = (x1, y1, x2, y2, angle, text) => {
            const { x, y } = getCoords(x1, y1, x2, y2, angle)
            ctx.font = '30px serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y);

        }


        // white middle pointer
        rotateLine(canvasWidth / 2, start - 60, canvasWidth / 2, canvasHeight / 2, 0, 3)

        // outer lines
        for (let i = 0; i < 361; i++) {
            if (i % 30 === 0)
                rotateLine(canvasWidth / 2, start, canvasWidth / 2, canvasHeight / 2, i - allAngles, 3)
            else
                rotateLine(canvasWidth / 2, start, canvasWidth / 2, canvasHeight / 2, i - allAngles, 1)
        }

        // hide part of outer lines
        ctx.beginPath();
        ctx.strokeStyle = '#000000'
        ctx.fillStyle = '#000000'
        ctx.arc(canvasWidth / 2, canvasHeight / 2, (canvasHeight / 2) - (start + 25), 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        //numbers and letters
        for (let i = 0; i < 12; i++) {
            if (i === 0)
                rotateText(canvasWidth / 2, (canvasHeight / 2) - (10 + start), canvasWidth / 2, canvasHeight / 2, -(allAngles + i * 30), "N")
            if (i === 3)
                rotateText(canvasWidth / 2, (canvasHeight / 2) - (10 + start), canvasWidth / 2, canvasHeight / 2, -(allAngles + i * 30), "E")
            if (i === 6)
                rotateText(canvasWidth / 2, (canvasHeight / 2) - (10 + start), canvasWidth / 2, canvasHeight / 2, -(allAngles + i * 30), "S")
            if (i === 9)
                rotateText(canvasWidth / 2, (canvasHeight / 2) - (10 + start), canvasWidth / 2, canvasHeight / 2, -(allAngles + i * 30), "W")
            rotateText(canvasWidth / 2, (canvasHeight / 2) - (110 + start), canvasWidth / 2, canvasHeight / 2, -(allAngles + i * 30), i * 30)
        }

        // middle
        ctx.beginPath();
        ctx.strokeStyle = '#201d1e'
        ctx.fillStyle = '#201d1e'
        ctx.arc(canvasWidth / 2, canvasHeight / 2, start - 60, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        for (let i = 0; i < 5; i++) {
            rotateLine(canvasWidth / 2, (canvasHeight / 2) - (start - 40), canvasWidth / 2, canvasHeight / 2, i * 90, 1)
            rotateLine(canvasWidth / 2, (canvasHeight / 2) - (start - 80), canvasWidth / 2, canvasHeight / 2, i * 90, 2)
        }

        // arrow
        rotateArrow(canvasWidth / 2, start - 10, canvasWidth / 2, canvasHeight / 2, -allAngles)

        ctx.fillStyle = 'white'
        ctx.font = '50px serif';
        ctx.textAlign = 'center';
        let letter = ""
        if ((desiredAngle >= 0 && desiredAngle < 22.5) || (desiredAngle >= 337.5 && desiredAngle < 360))
            letter = "N"
        else if (desiredAngle >= 22.5 && desiredAngle < 67.5)
            letter = "NE"
        else if (desiredAngle >= 67.5 && desiredAngle < 112.5)
            letter = "E"
        else if (desiredAngle >= 112.5 && desiredAngle < 157.5)
            letter = "SE"
        else if (desiredAngle >= 157.5 && desiredAngle < 202.5)
            letter = "S"
        else if (desiredAngle >= 202.5 && desiredAngle < 247.5)
            letter = "SW"
        else if (desiredAngle >= 247.5 && desiredAngle < 292.5)
            letter = "W"
        else if (desiredAngle >= 292.5 && desiredAngle < 337.5)
            letter = "NW"
        ctx.fillText(`${desiredAngle.toFixed(0)}° ${letter}`, canvasWidth / 2, canvasHeight + 100 - 30);


        const id = setInterval(() => {

            if (desiredAngle <= 180) {
                if (Math.abs(allAngles) < desiredAngle)
                    setAllAngles(allAngles - 1)
                else if (Math.abs(allAngles) > desiredAngle)
                    setAllAngles(allAngles + 1)
            } else {
                if (360 - allAngles > desiredAngle)
                    setAllAngles(allAngles + 1)
                else if (360 - allAngles < desiredAngle)
                    setAllAngles(allAngles - 1)
            }
        }, 10);

        if (showCompassPhone) {
            setDisplay('block')
            setTop("-100%")
            setTimeout(() => {
                setTop('0%')
                setTimeout(()=>{
                    setDesiredAngle(angle)
                },200)
            }, 400)

        } else {
            setDesiredAngle(0)
            setTop("-100%")
            setTimeout(function () {
                setDisplay('none');
            }, 500);

        }

        return () => {
            clearInterval(id);
        };

    }, [angle, allAngles,showCompassPhone,desiredAngle])

    return (
        <div id='compassPhoneBox' style={{ display: display }}>
            <div id='compassPhoneContainer' style={{top:top}}>
                <canvas id="compassPhone" width={500} height={600} ref={canvasRef} />
                <br/>
                <span id="compassPhoneInfo" width={500}>Make sure to use True North in the phone settings</span>
            </div>
        </div>
        )
}

export default CompassPhone