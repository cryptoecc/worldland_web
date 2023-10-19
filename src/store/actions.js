import { createAction } from '@reduxjs/toolkit';

// export your actions here

export const fetchDataRequest = createAction('FETCH_DATA_REQUEST');

export const fetchDataSuccess = createAction('FETCH_DATA_SUCCESS');

export const fetchDataFailure = createAction('FETCH_DATA_FAILURE');

// asynchronous tasks here

export const fetchData = () => (dispatch) => {
  dispatch(fetchDataRequest());
};
