import { create } from "zustand";

interface AuthState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    loading: false,
    setLoading: (loading) => set({ loading }),
}));
