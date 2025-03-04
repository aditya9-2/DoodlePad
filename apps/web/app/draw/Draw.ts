
import { getExisingCanvas } from "./http";
import { canvasShapes, Tools } from "./types";

export class Draw {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: canvasShapes[]
    private roomId: string
    private clicked: boolean
    private startX: number = 0;
    private startY: number = 0;
    private selectedTool: Tools = "circle"
    socket: WebSocket

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.roomId = roomId;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.clearShapes();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    async init() {
        this.existingShapes = await getExisingCanvas(this.roomId);
        this.clearShapes();
    }



    initHandlers() {
        this.socket.onmessage = (event) => {
            try {

                const message = JSON.parse(event.data);
                if (message.type === "chat") {
                    const parsedShape = JSON.parse(message.message)
                    this.existingShapes.push(parsedShape.shape);
                    this.clearShapes();
                } else if (message.type === "error") {
                    console.error("Server error:", message.message);
                }

            } catch (error) {
                console.error("Error processing message:", error, event.data);
            }

        }
    }

    clearShapes() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255,255,255)";
                this.ctx?.strokeRect(shape.X, shape.Y, shape.width, shape.height)

            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        })

    }

    setTool(tool: Tools) {
        this.selectedTool = tool
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
    }
    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape: canvasShapes | null = null;
        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                X: this.startX,
                Y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        }

        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearShapes();
            this.ctx.strokeStyle = "rgba(255, 255, 255)"
            const selectedTool = this.selectedTool;
            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }

    initMouseHandlers() {

        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

}