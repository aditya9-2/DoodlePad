"use client"

import { toast } from "sonner";
import MainCanvas from "./Canvas"
import { useEffect, useState } from "react";

export function Canvas({ roomId }: { roomId: string }) {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {

        const token = localStorage.getItem("authToken");
        console.log(`token: ${token}`);
        if (!token) {

            toast.error("Token not found", {
                position: "bottom-right",
                duration: 1500,
                style: { backgroundColor: "red", color: "white" },
            });
            return;
        }
        const socketString = process.env.NEXT_PUBLIC_SOCKET_URL as string

        const ws = new WebSocket(`${socketString}?token=${token}`);

        console.log(JSON.stringify(ws))

        ws.onopen = () => {

            setSocket(ws);

            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        }

    }, [roomId]);


    if (!socket) {
        return <div>
            connecting to server...
        </div>
    }


    return (
        <div>
            <MainCanvas roomId={roomId} socket={socket} />
        </div>
    )

}