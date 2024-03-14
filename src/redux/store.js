import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  REGISTER,
  PURGE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { useReducer } from './User/UserSlices';
import { waterReducer } from './Water/WaterSlices';

const persistUserConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

const persistedUser = persistReducer(persistUserConfig, useReducer);

const store = configureStore({
  reducer: {
    user: persistedUser,
    water: waterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistedStore = persistStore(store);

export default store;
