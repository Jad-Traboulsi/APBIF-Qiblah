import React, { useRef, useEffect } from 'react'

const Canvas = props => {

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const canvasWidth = ctx.canvas.width
        const canvasHeight = ctx.canvas.height
        //background
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        const getCoords = (x1,y1,x2,y2,angle) => {
            angle = angle * Math.PI / 180
            const xf = x2 + (x1 - x2) * Math.cos(angle) + (y1 - y2) * Math.sin(angle)
            const yf = x2 + (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle)
            return {x:xf,y:yf}
        }
        const rotateLine = (x1, y1, x2, y2, angle, width) => {
            const {x,y} = getCoords(x1,y1,x2,y2,angle)
            ctx.strokeStyle = 'white'
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
        }
        const rotateArrow = (x1, y1, x2, y2, angle) => {
            const p1 = getCoords(x1, y1, x2, y2, angle)
            const p2 = getCoords(x1+7, y1+12, x2, y2, angle)
            const p3 = getCoords(x1-7, y1+12, x2, y2, angle)
            ctx.strokeStyle = 'red'
            ctx.fillStyle = 'red'
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        const rotateText = (x1, y1, x2, y2, angle,text) => {
            const { x, y } = getCoords(x1-7, y1, x2, y2, angle)
            ctx.font = '30px serif';
            ctx.fillStyle = 'white '
            ctx.fillText(text, x, y);

        }

        // numbers
        rotateText(canvasWidth / 2, 70, canvasWidth / 2, canvasHeight / 2, 90, 0)

        // white pointer
        rotateLine(canvasWidth / 2, 40, canvasWidth / 2, canvasHeight / 2, 0, 3)

        // outer lines
        for (let i = 0; i < 361; i++) {
            if(i%30=== 0)
                rotateLine(canvasWidth / 2, 100, canvasWidth / 2, canvasHeight / 2, i, 3)
            else
                rotateLine(canvasWidth / 2, 100, canvasWidth / 2, canvasHeight / 2, i, 1)
        }
        // hide part of outer lines
        const hideRadius = 125;
        ctx.beginPath();
        ctx.strokeStyle = '#000000'
        ctx.fillStyle = '#000000'
        ctx.arc(canvasWidth/2, canvasHeight/2, hideRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // middle
        const grayRadius = 30;
        ctx.beginPath();
        ctx.strokeStyle = '#201d1e'
        ctx.fillStyle = '#201d1e'
        ctx.arc(canvasWidth / 2, canvasHeight / 2, grayRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        for (let i = 0; i < 5; i++) {
            rotateLine(canvasWidth / 2, (canvasHeight / 2) - 60, canvasWidth / 2, canvasHeight / 2, i * 90, 1)
            rotateLine(canvasWidth / 2, (canvasHeight / 2) - 10, canvasWidth / 2, canvasHeight / 2, i * 90, 2)
        }

        // arrow
        rotateArrow(canvasWidth / 2, 80,canvasWidth/2,canvasHeight/2,0)
        

        
    }, [])

    return <canvas width={500} height={500} ref={canvasRef} {...props} />
}

export default Canvas