import userSlice from '@/states/userSlice';
import sliceServers from '@/states/serverSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        user: userSlice,
        servers: sliceServers
    },
})

export default store
