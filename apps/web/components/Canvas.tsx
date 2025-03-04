import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";

export function Canvas({
    roomId,
    socket
}: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimentions, setDimentions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });


    const updateSize = () => {
        setDimentions({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    useEffect(() => {

        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket)
        }
    }, [dimentions, roomId, socket]);

    useEffect(() => {
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    });


    return (
        <div className="h-screen overflow-hidden">
            <canvas
                ref={canvasRef}
                width={dimentions.width}
                height={dimentions.height}
            ></canvas>
        </div>
    )
}