import { createReducer } from '@reduxjs/toolkit';
import { fetchAmountOutRequest, fetchAmountOutSuccess, fetchAmountOutFailure } from './actions';

const initialState = {
  data: '0',
  loading: false,
  error: null,
};

const central = createReducer(initialState, {
  [fetchAmountOutRequest]: (state) => {
    return { ...state, loading: true, error: null };
  },
  [fetchAmountOutSuccess]: (state, action) => {
    return { ...state, data: action.payload, loading: false };
  },
  [fetchAmountOutFailure]: (state, action) => {
    return { ...state, loading: false, error: action.payload };
  },
});

export default central;
