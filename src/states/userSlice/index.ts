import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

const INITIAL_STATE: IUser = {
    id: "",
    username: "",
    email: "",
    status: "",
    picture: "",
    pictureFilename: "",
    createdAt: "",
    updatedAt: ""
}

const sliceUser = createSlice({
    name: "user",
    initialState: INITIAL_STATE,
    reducers: {
        setLoggedUser(state, { payload }: PayloadAction<IUser>) {
            return { ...state, ...payload }
        },
        
    }
})

export const { setLoggedUser } = sliceUser.actions

export default sliceUser.reducer;

export const useUser = (state: any) => {
    return state.user as IUser;
}
