import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Minus, Pencil, RectangleHorizontalIcon, } from "lucide-react";
import { Tools } from "@/app/draw/types";
import { Draw } from "@/app/draw/Draw";


export function Canvas({
    roomId,
    socket
}: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [draw, setDraw] = useState<Draw>()
    const [selectedTool, setSelectedTool] = useState<Tools>("circle")


    const updateSize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    useEffect(() => {

        if (!draw) { return; }
        draw?.setTool(selectedTool);


    }, [selectedTool, draw])

    useEffect(() => {

        if (canvasRef.current) {

            const d = new Draw(canvasRef.current, roomId, socket);
            setDraw(d);

            return () => {
                d.destroy();
            }
        }

    }, [dimensions, roomId, socket]);

    useEffect(() => {
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, []);


    return (
        <>
            <div className="h-screen overflow-hidden">
                <IconTopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                <canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={dimensions.height}
                ></canvas>
            </div>
        </>
    )
}

function IconTopBar({ selectedTool, setSelectedTool }: {
    selectedTool: Tools;
    setSelectedTool: (s: Tools) => void;
}) {
    return (
        <div className="w-44 h-14 md:w-96 bg-slate-900 text-white fixed top-3 left-28 md:left-[36rem] rounded-md py-2">
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
                <IconButton
                    icon={<Minus />}
                    onClick={() => { setSelectedTool("line") }}
                    isActive={selectedTool === "line"}
                />
            </div>

        </div>

    )

}