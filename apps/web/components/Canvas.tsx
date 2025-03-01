import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

const MainCanvas = ({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        if (canvasRef.current) {

            const canvas = canvasRef.current;
            initDraw(canvas, roomId, socket);

        }
    }, [canvasRef, roomId, socket]);

    return (
        <div>
            <canvas ref={canvasRef} width={1920} height={1080}></canvas>
        </div>
    )
}

export default MainCanvas