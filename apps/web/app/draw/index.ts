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


    if (!ctx) return;
    if (!socket) return;

    socket.onmessage = (event) => {
        try {

            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message)
                existingShapes.push(parsedShape);
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
            message: JSON.stringify(shape),
            roomId
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

const clearShapes = (existingShapes: canvasShapes[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {

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
        return messageData;
    });
    return shapes;

}