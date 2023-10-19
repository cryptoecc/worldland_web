import { configureStore } from '@reduxjs/toolkit';
import central from './reducer';

const store = configureStore({
  reducer: central,
});

export { store };
