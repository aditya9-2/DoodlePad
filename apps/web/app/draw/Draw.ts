import { generateUniqueId } from "./generateUniqId";
import { getExisingCanvas } from "./http";
import { canvasShapes, Tools } from "./types";

const DRAW_UPDATE_THROTTLE_MS = 40; // ~25 broadcasts/sec — smooth, not floody

export class Draw {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: canvasShapes[];
    private roomId: string;
    private clicked: boolean;
    private startX: number = 0;
    private startY: number = 0;
    private selectedTool: Tools = "circle";
    private pencilPath: { x: number, y: number }[] = [];
    private isWriting: boolean = false;
    private currentText: string = "";
    socket: WebSocket;

    // FIX: offscreen buffer holding only CONFIRMED shapes. Rebuilt only
    // when shapes are added/removed — not on every mousemove.
    private baseCanvas: HTMLCanvasElement;
    private baseCtx: CanvasRenderingContext2D;

    // FIX: other users' in-progress shapes, keyed by their userId.
    // Rendered on top of the base layer, cleared when their shape finalizes.
    private remotePreviews: Map<string, canvasShapes> = new Map();

    private lastDrawUpdateSent: number = 0;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.roomId = roomId;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.socket = socket;
        this.clicked = false;

        this.baseCanvas = document.createElement("canvas");
        this.baseCtx = this.baseCanvas.getContext("2d")!;

        this.init();
        this.initHandlers();
        this.render();
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
            setTimeout(() => {
                this.rebuildBase();
                this.render();
            }, 100);
        } catch (error) {
            console.error("Error initializing canvas:", error);
            this.existingShapes = [];
            this.rebuildBase();
            this.render();
        }
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === "chat") {
                    const parsedShape = JSON.parse(message.message);
                    this.existingShapes.push(parsedShape.shape);

                    // A finalized shape arrived — that user is done dragging,
                    // clear whatever live preview we had for them.
                    if (message.fromUserId) {
                        this.remotePreviews.delete(message.fromUserId);
                    }

                    this.rebuildBase(); // shape set changed — rebuild the cache
                    this.render();

                } else if (message.type === "draw_update") {
                    // FIX: live in-progress shape from another user.
                    // Cheap — does NOT touch existingShapes or rebuild the base.
                    if (message.fromUserId) {
                        this.remotePreviews.set(message.fromUserId, message.shape);
                    }
                    this.render();

                } else if (message.type === "delete_shapes") {
                    const shapeIds: string[] = message.shapeIds;
                    this.existingShapes = this.existingShapes.filter(
                        (shape) => !shapeIds.includes(shape.id)
                    );
                    this.rebuildBase();
                    this.render();

                } else if (message.type === "error") {
                    console.error("Server error:", message.message);
                }
            } catch (error) {
                console.error("Error processing message:", error, event.data);
            }
        };
    }

    // FIX: renamed from clearShapes -> rebuildBase. This is the "expensive"
    // pass (iterates every confirmed shape) and now only runs when the
    // shape list actually changes, not on every mouse pixel of movement.
    private rebuildBase() {
        this.baseCanvas.width = this.canvas.width;
        this.baseCanvas.height = this.canvas.height;

        this.baseCtx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
        this.baseCtx.fillStyle = "rgba(0,0,0)";
        this.baseCtx.fillRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);

        this.existingShapes.forEach((shape) => this.drawShape(this.baseCtx, shape));
    }

    // FIX: renamed from the drawing-body of the old clearShapes. Draws ONE
    // shape onto a given context — reused for the base layer, live local
    // preview, and remote previews, instead of duplicating this logic.
    private drawShape(ctx: CanvasRenderingContext2D, shape: canvasShapes) {
        ctx.strokeStyle = "rgba(255,255,255)";

        if (shape.type === "rect") {
            ctx.strokeRect(shape.X, shape.Y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === "line") {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === "arrow") {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
            this.drawArrowHead(ctx, shape.startX, shape.startY, shape.endX, shape.endY);
        } else if (shape.type === "pencil" && shape.path?.length) {
            ctx.beginPath();
            ctx.moveTo(shape.path[0].x, shape.path[0].y);
            shape.path.forEach((point, index) => {
                if (index > 0) ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.closePath();
            // TODO: it has text reflecting issue, will see it later 
        } else if (shape.type === "text") {
            ctx.font = `${shape.fontSize || 16}px Arial`;
            ctx.fillStyle = shape.color || "rgb(255,255,255)";
            ctx.fillText(shape.text, shape.x, shape.y);
        }
    }

    // FIX: renamed from the render-call site. This is the CHEAP pass —
    // blit the cached base layer, then draw only what's actively moving
    // (local drag-in-progress + remote users' live previews) on top.
    // Safe to call on every mousemove / every incoming draw_update.
    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.baseCanvas, 0, 0);

        this.remotePreviews.forEach((shape) => {
            this.drawShape(this.ctx, shape);
        });

        if (this.isWriting && this.selectedTool === "text") {
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = "rgb(255,255,255)";
            this.ctx.fillText(this.currentText, this.startX, this.startY);
        }
    }

    setTool(tool: Tools) {
        this.selectedTool = tool;
    }

    resizeCanvas(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.rebuildBase();
        this.render();
    }

    private drawArrowHead(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
        const headLength = 10;
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headLength * Math.cos(angle - Math.PI / 6),
            endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headLength * Math.cos(angle + Math.PI / 6),
            endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        ctx.closePath();
    }

    mouseDownHandler = (e: MouseEvent) => {
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

        if (this.selectedTool === "pencil") {
            this.pencilPath = [{ x: this.startX, y: this.startY }];
        }
    };

    mouseUpHandler = (e: MouseEvent) => {
        if (this.selectedTool === "text" && this.isWriting) {
            return;
        }
        this.clicked = false;
        const endX = e.clientX;
        const endY = e.clientY;

        if (this.selectedTool === "erase") {
            const eraseX = Math.min(this.startX, endX);
            const eraseY = Math.min(this.startY, endY);
            const eraseWidth = Math.abs(endX - this.startX);
            const eraseHeight = Math.abs(endY - this.startY);

            const shapesToDelete = this.existingShapes.filter((shape) => {
                if (shape.type === "circle") {
                    const circleLeft = shape.centerX - shape.radius;
                    const circleRight = shape.centerX + shape.radius;
                    const circleTop = shape.centerY - shape.radius;
                    const circleBottom = shape.centerY + shape.radius;
                    return (
                        circleLeft >= eraseX && circleRight <= eraseX + eraseWidth &&
                        circleTop >= eraseY && circleBottom <= eraseY + eraseHeight
                    );
                } else if (shape.type === "rect") {
                    const rectLeft = shape.X;
                    const rectRight = shape.X + shape.width;
                    const rectTop = shape.Y;
                    const rectBottom = shape.Y + shape.height;
                    return (
                        rectLeft >= eraseX && rectRight <= eraseX + eraseWidth &&
                        rectTop >= eraseY && rectBottom <= eraseY + eraseHeight
                    );
                } else if (shape.type === "line" || shape.type === "arrow") {
                    const lineLeft = Math.min(shape.startX, shape.endX);
                    const lineRight = Math.max(shape.startX, shape.endX);
                    const lineTop = Math.min(shape.startY, shape.endY);
                    const lineBottom = Math.max(shape.startY, shape.endY);
                    return (
                        lineLeft >= eraseX && lineRight <= eraseX + eraseWidth &&
                        lineTop >= eraseY && lineBottom <= eraseY + eraseHeight
                    );
                } else if (shape.type === "pencil") {
                    return shape.path.every(
                        (point) =>
                            point.x >= eraseX && point.x <= eraseX + eraseWidth &&
                            point.y >= eraseY && point.y <= eraseY + eraseHeight
                    );
                } else if (shape.type === "text") {
                    const textWidth = this.ctx.measureText(shape.text).width;
                    const textHeight = shape.fontSize || 16;
                    const textLeft = shape.x;
                    const textRight = shape.x + textWidth;
                    const textTop = shape.y - textHeight;
                    const textBottom = shape.y;
                    return (
                        textLeft >= eraseX && textRight <= eraseX + eraseWidth &&
                        textTop >= eraseY && textBottom <= eraseY + eraseHeight
                    );
                }
                return false;
            });

            const shapeIdsToDelete = shapesToDelete.map((shape) => shape.id);

            this.existingShapes = this.existingShapes.filter(
                (shape) => !shapeIdsToDelete.includes(shape.id)
            );

            this.socket.send(
                JSON.stringify({
                    type: "delete_shapes",
                    roomId: this.roomId,
                    shapeIds: shapeIdsToDelete,
                })
            );

            this.rebuildBase();
            this.render();
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

        if (!shape) return;

        this.existingShapes.push(shape);

        this.socket.send(
            JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId: this.roomId,
            })
        );

        this.rebuildBase();
        this.render();
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked) return;

        const currentX = e.clientX;
        const currentY = e.clientY;
        const width = currentX - this.startX;
        const height = currentY - this.startY;
        const selectedTool = this.selectedTool;

        // FIX: cheap render — blits cached base, no per-shape redraw of
        // everything else on the board.
        this.render();

        let liveShape: canvasShapes | null = null;

        if (selectedTool === "rect") {
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.strokeRect(this.startX, this.startY, width, height);
            liveShape = {
                id: "preview", type: "rect",
                X: this.startX, Y: this.startY, width, height,
            };
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            const centerX = this.startX + radius;
            const centerY = this.startY + radius;
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
            liveShape = { id: "preview", type: "circle", radius, centerX, centerY };
        } else if (selectedTool === "line") {
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();
            this.ctx.closePath();
            liveShape = {
                id: "preview", type: "line",
                startX: this.startX, startY: this.startY, endX: currentX, endY: currentY,
            };
        } else if (selectedTool === "arrow") {
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();
            this.drawArrowHead(this.ctx, this.startX, this.startY, currentX, currentY);
            liveShape = {
                id: "preview", type: "arrow",
                startX: this.startX, startY: this.startY, endX: currentX, endY: currentY,
            };
        } else if (selectedTool === "pencil") {
            this.pencilPath.push({ x: currentX, y: currentY });
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.beginPath();
            this.ctx.moveTo(this.pencilPath[0].x, this.pencilPath[0].y);
            this.pencilPath.forEach((point, index) => {
                if (index > 0) this.ctx.lineTo(point.x, point.y);
            });
            this.ctx.stroke();
            this.ctx.closePath();
            liveShape = { id: "preview", type: "pencil", path: this.pencilPath };
        } else if (selectedTool === "erase") {
            const eraseWidth = currentX - this.startX;
            const eraseHeight = currentY - this.startY;
            this.ctx.save();
            this.ctx.strokeStyle = "red";
            this.ctx.setLineDash([5, 3]);
            this.ctx.strokeRect(this.startX, this.startY, eraseWidth, eraseHeight);
            this.ctx.restore();
        }

        // FIX: this is the core fix for "not real-time" — broadcast the
        // in-progress shape, throttled so we're not flooding the socket
        // on every pixel of mouse movement.
        if (liveShape) {
            const now = Date.now();
            if (now - this.lastDrawUpdateSent >= DRAW_UPDATE_THROTTLE_MS) {
                this.lastDrawUpdateSent = now;
                this.socket.send(
                    JSON.stringify({
                        type: "draw_update",
                        roomId: this.roomId,
                        shape: liveShape,
                    })
                );
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
            this.socket.send(
                JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ shape }),
                    roomId: this.roomId,
                })
            );
            this.isWriting = false;
            this.currentText = "";
            this.rebuildBase();
            this.render();
            return;
        } else if (e.key === "Backspace") {
            this.currentText = this.currentText.slice(0, -1);
            this.render();
            e.preventDefault();
            return;
        } else if (e.key.length === 1) {
            this.currentText += e.key;
            this.render();
            return;
        }
    };

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}