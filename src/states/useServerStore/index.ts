import { IServer } from "@/shared/interfaces/IServer";
import { create } from "zustand";

type IServerStore = {
    serversOfUser: IServer[] | [];
    serversIdsOfUser: string[];
    serverWhereUserIsOwner: string[];
    add(server: IServer): void;
    setServersOfUser(servers: IServer[]): void;
    setServersWhereUserIsOwner(serversIds: string[]): void;
    reset(): void;
}

const useServerStore = create<IServerStore>((set) => ({
    serversOfUser: [],
    serversIdsOfUser: [],
    serverWhereUserIsOwner: [],

    add: (server: IServer) => {
        set((state: IServerStore) => ({
            serversOfUser: [...state.serversOfUser, server],
            serversIdsOfUser: [...state.serversIdsOfUser, server.id]
        }));
    },

    setServersOfUser: (servers: IServer[]) => {
        const serverIds = servers.map(server => server.id);

        set((state: IServerStore) => ({
            serversOfUser: servers,
            serversIdsOfUser: serverIds,
        }));
    },

    setServersWhereUserIsOwner: (serversIds: string[]) => {
        set((state: IServerStore) => ({
            serverWhereUserIsOwner: serversIds
        }))
    },

    reset(): void {
        set({ serversOfUser: [], serversIdsOfUser: [] });
    }
}))

export { useServerStore };
