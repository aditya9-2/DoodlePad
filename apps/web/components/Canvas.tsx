import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, } from "lucide-react";

type shape = "circle" | "rect" | "pencil";

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
    const [selectedTool, setSelectedTool] = useState<shape>("circle")


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
            <IconTopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            <canvas
                ref={canvasRef}
                width={dimentions.width}
                height={dimentions.height}
            ></canvas>
        </div>
    )
}

function IconTopBar({ selectedTool, setSelectedTool }: {
    selectedTool: shape;
    setSelectedTool: (s: shape) => void;
}) {
    return (
        <div className="w-44 h-14 md:w-96 bg-slate-600 text-white fixed top-3 left-28 md:left-[36rem] rounded-md py-2">
            <div className="flex gap-2 items-center justify-center">
                <IconButton
                    icon={<Circle />}
                    onClick={() => { setSelectedTool("circle") }}
                    isActive={selectedTool === "circle"}
                />
                <IconButton
                    icon={<Pencil />}
                    onClick={() => { setSelectedTool("pencil") }}
                    isActive={selectedTool === "pencil"}
                />
                <IconButton
                    icon={<RectangleHorizontalIcon />}
                    onClick={() => { setSelectedTool("rect") }}
                    isActive={selectedTool === "rect"}
                />
            </div>

        </div>

    )

}