import { generateUniqueId } from "./generateUniqId";
import { getExisingCanvas } from "./http";
import { canvasShapes, Tools } from "./types";

export class Draw {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: canvasShapes[];
    private roomId: string;
    private clicked: boolean;
    private startX: number = 0;
    private startY: number = 0;
    private selectedTool: Tools = "circle";
    private pencilPath: { x: number, y: number }[] = []; // Stores freehand drawing points
    private isWriting: boolean = false;
    private currentText: string = "";
    socket: WebSocket;

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
        document.removeEventListener("keydown", this.keyDownHandler);
    }

    async init() {
        try {
            this.existingShapes = await getExisingCanvas(this.roomId);
            this.resizeCanvas(this.canvas.width, this.canvas.height);
            // Force a redraw after a short delay to ensure the canvas is ready
            setTimeout(() => {
                this.clearShapes();
            }, 100);
        } catch (error) {
            console.error("Error initializing canvas:", error);
            this.existingShapes = [];
            this.clearShapes();
        }
    }

    // Initialize WebSocket handlers.
    initHandlers() {
        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "chat") {
                    // When a new shape is received, add it to the local array and redraw.
                    const parsedShape = JSON.parse(message.message);
                    this.existingShapes.push(parsedShape.shape);
                    this.clearShapes();
                } else if (message.type === "delete_shapes") {
                    // If deletion is broadcast from the server, remove those shapes locally.
                    const shapeIds: string[] = message.shapeIds;
                    this.existingShapes = this.existingShapes.filter(
                        (shape) => !shapeIds.includes(shape.id)
                    );
                    this.clearShapes();
                } else if (message.type === "error") {
                    console.error("Server error:", message.message);
                }
            } catch (error) {
                console.error("Error processing message:", error, event.data);
            }
        };
    }


    clearShapes() {
        // Clear the entire canvas and fill with a black background.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw each shape.
        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255,255,255)";
                this.ctx.strokeRect(shape.X, shape.Y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(
                    shape.centerX,
                    shape.centerY,
                    Math.abs(shape.radius),
                    0,
                    Math.PI * 2
                );
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "arrow") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.drawArrowHead(shape.startX, shape.startY, shape.endX, shape.endY);
            } else if (shape.type === "pencil" && shape.path?.length) {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.path[0].x, shape.path[0].y);
                shape.path.forEach((point, index) => {
                    if (index > 0) {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "text") {
                this.ctx.font = `${shape.fontSize || 16}px Arial`;
                this.ctx.fillStyle = shape.color || "rgb(255,255,255)";
                this.ctx.fillText(shape.text, shape.x, shape.y);
            }
            // Note for me : Erase is handled by removing shapes, so no need to draw an "erase" shape.
        });

        // If in text mode, draw the currently typed text.
        if (this.isWriting && this.selectedTool === "text") {
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = "rgb(255,255,255)";
            this.ctx.fillText(this.currentText, this.startX, this.startY);
        }
    }

    // Set the current drawing tool.
    setTool(tool: Tools) {
        this.selectedTool = tool;
    }

    // Resize the canvas and redraw shapes.
    resizeCanvas(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.clearShapes();
    }

    // Draw an arrow head at the end of a line.
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

    // Mouse down handler.
    mouseDownHandler = (e: MouseEvent) => {
        // For text tool, start capturing keystrokes.
        if (this.selectedTool === "text") {
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.isWriting = true;
            this.currentText = "";
            document.addEventListener("keydown", this.keyDownHandler);
            return;
        }
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        // Initialize pencil drawing.
        if (this.selectedTool === "pencil") {
            this.pencilPath = [{ x: this.startX, y: this.startY }];
        }
    };

    // Mouse up handler.
    mouseUpHandler = (e: MouseEvent) => {
        // If still writing text, do not finalize.
        if (this.selectedTool === "text" && this.isWriting) {
            return;
        }
        this.clicked = false;
        const endX = e.clientX;
        const endY = e.clientY;

        // === ERASE TOOL LOGIC ===
        if (this.selectedTool === "erase") {
            // Calculate the erase area's top-left corner and dimensions.
            const eraseX = Math.min(this.startX, endX);
            const eraseY = Math.min(this.startY, endY);
            const eraseWidth = Math.abs(endX - this.startX);
            const eraseHeight = Math.abs(endY - this.startY);

            // Identify shapes completely within the erase area.
            const shapesToDelete = this.existingShapes.filter((shape) => {
                if (shape.type === "circle") {
                    const circleLeft = shape.centerX - shape.radius;
                    const circleRight = shape.centerX + shape.radius;
                    const circleTop = shape.centerY - shape.radius;
                    const circleBottom = shape.centerY + shape.radius;
                    return (
                        circleLeft >= eraseX &&
                        circleRight <= eraseX + eraseWidth &&
                        circleTop >= eraseY &&
                        circleBottom <= eraseY + eraseHeight
                    );
                } else if (shape.type === "rect") {
                    const rectLeft = shape.X;
                    const rectRight = shape.X + shape.width;
                    const rectTop = shape.Y;
                    const rectBottom = shape.Y + shape.height;
                    return (
                        rectLeft >= eraseX &&
                        rectRight <= eraseX + eraseWidth &&
                        rectTop >= eraseY &&
                        rectBottom <= eraseY + eraseHeight
                    );
                } else if (shape.type === "line" || shape.type === "arrow") {
                    const lineLeft = Math.min(shape.startX, shape.endX);
                    const lineRight = Math.max(shape.startX, shape.endX);
                    const lineTop = Math.min(shape.startY, shape.endY);
                    const lineBottom = Math.max(shape.startY, shape.endY);
                    return (
                        lineLeft >= eraseX &&
                        lineRight <= eraseX + eraseWidth &&
                        lineTop >= eraseY &&
                        lineBottom <= eraseY + eraseHeight
                    );
                } else if (shape.type === "pencil") {
                    // Check if every point in the pencil path is within the erase area.
                    return shape.path.every(
                        (point) =>
                            point.x >= eraseX &&
                            point.x <= eraseX + eraseWidth &&
                            point.y >= eraseY &&
                            point.y <= eraseY + eraseHeight
                    );
                } else if (shape.type === "text") {
                    // Estimate text bounding box.
                    const textWidth = this.ctx.measureText(shape.text).width;
                    const textHeight = shape.fontSize || 16;
                    const textLeft = shape.x;
                    const textRight = shape.x + textWidth;
                    const textTop = shape.y - textHeight;
                    const textBottom = shape.y;
                    return (
                        textLeft >= eraseX &&
                        textRight <= eraseX + eraseWidth &&
                        textTop >= eraseY &&
                        textBottom <= eraseY + eraseHeight
                    );
                }
                return false;
            });

            // Extract the IDs of shapes to delete.
            const shapeIdsToDelete = shapesToDelete.map((shape) => shape.id);

            // Remove these shapes from our local array.
            this.existingShapes = this.existingShapes.filter(
                (shape) => !shapeIdsToDelete.includes(shape.id)
            );

            // Send a deletion message to the server so the shapes are removed from the DB.
            this.socket.send(
                JSON.stringify({
                    type: "delete_shapes",
                    roomId: this.roomId,
                    shapeIds: shapeIdsToDelete,
                })
            );

            this.clearShapes();
            return;
        }

        let shape: canvasShapes | null = null;
        if (this.selectedTool === "rect") {
            shape = {
                id: generateUniqueId(),
                type: "rect",
                X: this.startX,
                Y: this.startY,
                width: endX - this.startX,
                height: endY - this.startY,
            };
        } else if (this.selectedTool === "circle") {
            const width = endX - this.startX;
            const height = endY - this.startY;
            const radius = Math.max(width, height) / 2;
            shape = {
                id: generateUniqueId(),
                type: "circle",
                radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            };
        } else if (this.selectedTool === "line") {
            shape = {
                id: generateUniqueId(),
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: endX,
                endY: endY,
            };
        } else if (this.selectedTool === "arrow") {
            shape = {
                id: generateUniqueId(),
                type: "arrow",
                startX: this.startX,
                startY: this.startY,
                endX: endX,
                endY: endY,
            };
        } else if (this.selectedTool === "pencil") {
            shape = {
                id: generateUniqueId(),
                type: "pencil",
                path: this.pencilPath,
            };
        }

        if (!shape) {
            return;
        }

        // Add the new shape locally.
        this.existingShapes.push(shape);

        // Send the new shape to the server.
        this.socket.send(
            JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId: this.roomId,
            })
        );

        this.clearShapes();
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            this.clearShapes();
            const currentX = e.clientX;
            const currentY = e.clientY;
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            this.ctx.strokeStyle = "rgba(255, 255, 255)";
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
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (selectedTool === "arrow") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                this.drawArrowHead(this.startX, this.startY, currentX, currentY);
            } else if (selectedTool === "pencil") {

                this.pencilPath.push({ x: currentX, y: currentY });
                this.ctx.beginPath();
                this.ctx.moveTo(this.pencilPath[0].x, this.pencilPath[0].y);
                this.pencilPath.forEach((point, index) => {
                    if (index > 0) {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (selectedTool === "erase") {
                // Draw a preview rectangle for the erase area.
                const eraseWidth = currentX - this.startX;
                const eraseHeight = currentY - this.startY;
                this.ctx.save();
                this.ctx.strokeStyle = "red"; // Preview border color.
                this.ctx.setLineDash([5, 3]); // Dashed border style.
                this.ctx.strokeRect(this.startX, this.startY, eraseWidth, eraseHeight);
                this.ctx.restore();
            }
        }
    };

    keyDownHandler = (e: KeyboardEvent) => {
        if (!this.isWriting) return;
        if (e.key === "Enter") {
            document.removeEventListener("keydown", this.keyDownHandler);
            const shape: canvasShapes = {
                id: generateUniqueId(),
                type: "text",
                text: this.currentText,
                x: this.startX,
                y: this.startY,
                fontSize: 16,
                color: "rgb(255,255,255)",
            };
            this.existingShapes.push(shape);
            // Send the text shape to the server.
            this.socket.send(
                JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ shape }),
                    roomId: this.roomId,
                })
            );
            this.isWriting = false;
            this.currentText = "";
            this.clearShapes();
            return;
        } else if (e.key === "Backspace") {
            this.currentText = this.currentText.slice(0, -1);
            this.clearShapes();
            e.preventDefault();
            return;
        } else if (e.key.length === 1) {
            this.currentText += e.key;
            this.clearShapes();
            return;
        }
    };


    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}
