import { create } from "zustand";

export interface IUser {
    id: string;
    username: string;
    email: string;
    status: string;
    picture: string;
    pictureFilename: string;
    createdAt: string;
    updatedAt: string;
  }

type IUserStore = {
    isLoggedIn: boolean;
    loggedUser: IUser;
    authenticate: (token: string, userId: number) => void;
    setLoggedUser: (user: IUser) => void;
    logout: () => void;
}

const useUserStore = create<IUserStore>((set) => ({
    isLoggedIn: !!localStorage.getItem("token"),
    loggedUser: {} as IUser,

    authenticate: (token: string, userId: number) => {
        localStorage.setItem("token", token),
        localStorage.setItem("userId", userId.toString())
        set({ isLoggedIn: true, })
    },

    setLoggedUser: (user: IUser) => {
        set({ loggedUser: user });
    },

    logout: () => {
        localStorage.removeItem("token"),
        localStorage.removeItem("userId")
        set({ isLoggedIn: false, })
    }
}));

export { useUserStore };