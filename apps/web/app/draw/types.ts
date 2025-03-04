export type canvasShapes = {
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

export type Tools = "circle" | "rect" | "pencil";