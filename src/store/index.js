import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import central from './reducer';

const store = configureStore({
  reducer: central,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export { store };
