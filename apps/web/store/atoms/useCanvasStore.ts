import { create } from "zustand";

interface Canvas {
    id: string;
    title: string;
    description: string;
    link: string;
}

interface CanvasStore {
    canvases: Canvas[];
    setCanvases: (canvases: Canvas[]) => void;
    addCanvas: (canvas: Canvas) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
    canvases: [],
    setCanvases: (canvases) => set({ canvases }),
    addCanvas: (canvas) => set((state) => ({ canvases: [...state.canvases, canvas] })),
}));
