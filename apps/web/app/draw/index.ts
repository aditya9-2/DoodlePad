import axios from "axios";


type canvasShapes = {
    type: "rect",
    width: number,
    height: number,
    X: number;
    Y: number;
} | {
    type: "circle",
    centerX: number;
    centerY: number;
    radius: number
}


export const initDraw = async (canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) => {

    const existingShapes: canvasShapes[] = await getExisingCanvas(roomId);

    const ctx = canvas.getContext("2d");


    if (!ctx) return;
    if (!socket) return;

    if (socket.onmessage) {

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message)
                existingShapes.push(parsedShape);
                clearShapes(existingShapes, canvas, ctx);

            }
        }
    }

    clearShapes(existingShapes, canvas, ctx);

    let clicked = false;
    let startY = 0;
    let startX = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const shape: canvasShapes = {
            type: "rect",
            width: width,
            height: height,
            X: startX,
            Y: startY
        }

        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape })
        }));
    });

    canvas.addEventListener("mousemove", (e) => {

        if (clicked) {

            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearShapes(existingShapes, canvas, ctx);

            ctx.strokeStyle = "rgba(255,255,255)";
            ctx?.strokeRect(startX, startY, width, height)

        }
    });
}

export const clearShapes = (existingShapes: canvasShapes[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx?.strokeRect(shape.X, shape.Y, shape.width, shape.height)

        }
    })

}

export const getExisingCanvas = async (roomId: string) => {

    const response = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/chats/${roomId}`);
    const messages = response.data.message;

    const shapes = messages.map((shape: { message: string }) => {
        const messageData = JSON.parse(shape.message);
        return messageData;
    });
    return shapes;

}