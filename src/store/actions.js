import { createAction } from '@reduxjs/toolkit';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { chain_query } from 'configs/contract_calls';
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
import { from_wei, to_wei } from 'utils/util';

// export your actions here

export const fetchAmountOutRequest = createAction('FETCH_AMOUNT_OUT_REQUEST');

export const fetchAmountOutSuccess = createAction('FETCH_AMOUNT_OUT_SUCCESS');

export const fetchAmountOutFailure = createAction('FETCH_AMOUNT_OUT_FAILURE');

// asynchronous tasks here

export const fetchData = (payload) => {
  return async (dispatch) => {
    dispatch(fetchAmountOutRequest());
    try {
      let { amountIn, tokenA, tokenB } = payload;
      let txParams = {
        chain: 2,
        contract_address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        abikind: ABI.LVSWAPV2_ROUTER,
        methodname: FUNCTION.GETAMOUNTOUT,
        f_args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY], to_wei(amountIn), tokenA, tokenB],
      };
      let resp = (await chain_query(txParams)).toString();
      dispatch(fetchAmountOutSuccess(resp));
    } catch (err) {
      console.log({ RESPONSEERROR: err });
      dispatch(fetchAmountOutFailure(err));
    }
  };
};
