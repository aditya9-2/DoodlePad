
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
    private pencilPath: { x: number, y: number }[] = [] // Stores all points for freehand drawing
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
            } else if (shape.type === "line") {
                this.ctx.beginPath()
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();

            } else if (shape.type === "arrow") {
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.drawArrowHead(shape.startX, shape.startY, shape.endX, shape.endY);

            } else if (shape.type === "pencil" && shape.path?.length) {
                this.ctx.moveTo(shape.path[0].x, shape.path[0].y);
                this.ctx.beginPath();

                shape.path.forEach((point, index) => {
                    if (index > 0) {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });

                this.ctx.stroke();
                this.ctx.closePath();
            }
        })

    }

    setTool(tool: Tools) {
        this.selectedTool = tool
    }

    drawArrowHead(startX: number, startY: number, endX: number, endY: number) {
        const headLength = 10;
        const angle = Math.atan2(endY - startY, endX - startX);

        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - headLength * Math.cos(angle - Math.PI / 6),
            endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - headLength * Math.cos(angle + Math.PI / 6),
            endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
        this.ctx.closePath();
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true

        this.startX = e.clientX
        this.startY = e.clientY

        if (this.selectedTool === "pencil") {

            this.pencilPath = [{
                x: this.startX,
                y: this.startY
            }];
        }

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
        } else if (selectedTool === "line") {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            }
        } else if (selectedTool === "arrow") {
            shape = {
                type: "arrow",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            }
        } else if (selectedTool === "pencil") {
            shape = {
                type: "pencil",
                path: this.pencilPath
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
            this.clearShapes();

            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

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

            } else if (selectedTool === "line") {

                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.stroke();
                this.ctx.closePath();

            } else if (selectedTool === "arrow") {
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.stroke();

                this.drawArrowHead(this.startX, this.startY, e.clientX, e.clientY)

            } else if (selectedTool === "pencil") {
                // store points and draw a continuous line
                this.pencilPath.push({
                    x: e.clientX,
                    y: e.clientY
                });

                this.ctx.beginPath();
                this.ctx.moveTo(this.pencilPath[0].x, this.pencilPath[0].y);

                this.pencilPath.forEach((point, index) => {
                    if (index > 0) {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                /**
                 * this id the for loop i conb=vert with forEach as this is simple array!!!
                     for (let i = 1; i < this.pencilPath.length; i++) {
                        this.ctx.lineTo(this.pencilPath[i].x, this.pencilPath[i].y);
                    }
                 */
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