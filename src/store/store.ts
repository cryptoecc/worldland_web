import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';

// import counterReducer from "./counter/counterSlice";
// import CustomizerReducer from "./customizer/CustomizerSlice";
// import ChatsReducer from "./apps/chat/ChatSlice";
// import UserReducer from "./user/UserSlice";
import EmailReducer from './user/emailSlice';

const persistConfig = {
  key: 'root',
  storage,
};

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    // customizer: persistReducer<any>(persistConfig, CustomizerReducer),
    // chatReducer: ChatsReducer,
    // userReducer: UserReducer,
    emailReducer: EmailReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

const rootReducer = combineReducers({
  //   counter: counterReducer,
  //   customizer: CustomizerReducer,
  //   chatReducer: ChatsReducer,
  //   userReducer: UserReducer,
  emailReducer: EmailReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
