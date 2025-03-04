/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";


type canvasShapes = {
    type: "rect";
    width: number;
    height: number;
    X: number;
    Y: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}


// Create a token provider that will be initialized on the client side
const authTokenProvider = {
    token: null as string | null,
    setToken: function (newToken: string) {
        this.token = newToken;
    },
    getToken: function () {
        // If we're in the browser and don't have a token yet, try to get it from localStorage
        if (typeof window !== 'undefined' && !this.token) {
            this.token = localStorage.getItem("authToken");
        }
        return this.token;
    }
};

// This function can be called from client components to initialize the token
export const initAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("authToken");
        if (token) {
            authTokenProvider.setToken(token);
        }
    }
};


export const initDraw = async (canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) => {

    const ctx = canvas.getContext("2d");
    const existingShapes: canvasShapes[] = await getExisingCanvas(roomId);
    console.log(`shapes: ${JSON.stringify(existingShapes)}`);


    if (!ctx) return;
    if (!socket) return;

    socket.onmessage = (event) => {
        try {

            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message)
                existingShapes.push(parsedShape.shape);
                clearShapes(existingShapes, canvas, ctx);
            } else if (message.type === "error") {
                console.error("Server error:", message.message);
            }

        } catch (error) {
            console.error("Error processing message:", error, event.data);
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

        // @ts-ignore
        const selectedTool = window.selectedTool;
        let shape: canvasShapes | null = null;

        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                width: width,
                height: height,
                X: startX,
                Y: startY
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                centerX: startX + radius,
                centerY: startY + radius,
                radius: radius
            }

        } else if (selectedTool === "pencil") {
            // Todo: logic to add pencil shape
        }

        if (!shape) return;

        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId
        }));
    });

    canvas.addEventListener("mousemove", (e) => {

        if (clicked) {

            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearShapes(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255,255,255)";

            // @ts-ignore
            const selectedTool = window.selectedTool;

            if (selectedTool === "rect") {

                ctx?.strokeRect(startX, startY, width, height);

            } else if (selectedTool === "circle") {

                const radius = Math.max(width, height) / 2;
                const centerX = startX + radius;
                const centerY = startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();

            } else if (selectedTool === "pencil") {
                // add pencil

            }


        }
    });
}

const clearShapes = (existingShapes: canvasShapes[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx?.strokeRect(shape.X, shape.Y, shape.width, shape.height)

        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    })

}

const getExisingCanvas = async (roomId: string) => {

    const token = authTokenProvider.getToken();

    if (!token) {
        console.log(`token not found in /draw/index`);
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/chats/${roomId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const messages = response.data.messages;

    const shapes = messages.map((shape: { message: string }) => {
        const messageData = JSON.parse(shape.message);
        return messageData.shape;
    });
    return shapes;

}