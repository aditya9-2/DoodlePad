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
    path: { x: number; y: number }[]; // array of points
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "arrow";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "erase",
    path: { x: number; y: number }[];

}

export type Tools = "circle" | "rect" | "pencil" | "line" | "arrow" | "erase";