export type canvasShapes = {
    id: string;
    type: "rect";
    width: number;
    height: number;
    X: number;
    Y: number;
} | {
    id: string;
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    id: string;
    type: "pencil";
    path: { x: number; y: number }[]; // array of points
} | {
    id: string;
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    id: string;
    type: "arrow";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    id: string;
    type: "erase";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id: string;

    type: "text";
    text: string;
    x: number;
    y: number;
    fontSize?: number;
    color?: string;
}

export type Tools = "circle" | "rect" | "pencil" | "line" | "arrow" | "erase" | "text" | "select";