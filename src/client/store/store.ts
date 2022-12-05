import { configureStore } from '@reduxjs/toolkit';

import rolesReducer from './rolesSlice/rolesSlice';

const store = configureStore({
  reducer: {
    roles: rolesReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;