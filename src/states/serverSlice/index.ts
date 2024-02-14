import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IServer } from '@/shared/interfaces/IServer'

interface State {
    servers: IServer[];
    serversWhereUserIsMember: string[];
    serversWhereUserIsOwner: string[];
}

const INITIAL_STATE = {
    servers: [] as IServer[],
    serversWhereUserIsMember: [] as string[],
    serversWhereUserIsOwner: [] as string[],
}

const slicesServers = createSlice({
    name: "servers",
    initialState: INITIAL_STATE,
    reducers: {
        setServers(state, { payload }: PayloadAction<IServer[]>) {
            state.servers = payload;
        },
        addServer(state, { payload }: PayloadAction<IServer>) {
            state.servers.push({ ...payload });
            state.serversWhereUserIsMember.push(payload.id);
        }
    }
})

export const { setServers, addServer } = slicesServers.actions


export default slicesServers.reducer

export const selectServers = (state: any) => {
    return state.servers
};

export const useServers = (state: State) => {
    return state
}
