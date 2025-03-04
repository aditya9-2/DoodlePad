"use client"

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";


export function RoomCanvas({ roomId }: { roomId: string }) {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {

        const token = localStorage.getItem("authToken");

        if (!token) {

            toast.error("Token not found", {
                position: "bottom-right",
                duration: 1500,
                style: { backgroundColor: "red", color: "white" },
            });
            return;
        }
        const socketString = process.env.NEXT_PUBLIC_SOCKET_URL!

        const ws = new WebSocket(`${socketString}?token=${token}`);

        ws.onopen = () => {
            setSocket(ws);

            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        }

    }, [roomId]);


    if (!socket) {
        return <div className="h-screen w-full flex justify-center items-center">
            <p className="text-xl">connecting to server...</p>
        </div>
    }


    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
    )

}