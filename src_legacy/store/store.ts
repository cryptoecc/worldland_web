import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { persistReducer, persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import central from './reducer';
// import counterReducer from "./counter/counterSlice";
// import CustomizerReducer from "./customizer/CustomizerSlice";
// import ChatsReducer from "./apps/chat/ChatSlice";
import UserReducer from './user/UserSlice';
import EmailReducer from './user/emailSlice';

const rootReducer = combineReducers({
  //   counter: counterReducer,
  //   customizer: CustomizerReducer,
  //   chatReducer: ChatsReducer,
  userReducer: UserReducer,
  emailReducer: EmailReducer,
  central,
});

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['userReducer', 'emailReducer'], // persist가 필요한 특정 리듀서를 지정
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

// {
//   // counter: counterReducer,
//   // customizer: persistReducer<any>(persistConfig, CustomizerReducer),
//   // chatReducer: ChatsReducer,
//   reducer: central,
//   userReducer: UserReducer,
//   emailReducer: EmailReducer,
// },

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
