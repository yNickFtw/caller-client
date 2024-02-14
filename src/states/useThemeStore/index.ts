import { create } from "zustand";

type IThemeStore = {
    themeSelected: string;
    setStoreTheme: (theme: string) => void;
}

const useThemeStore = create<IThemeStore>((set) => ({
    themeSelected: localStorage.getItem("vite-ui-theme") as string,

    setStoreTheme: (theme) => {
        set({ themeSelected: theme });
    },
}))

export { useThemeStore };
