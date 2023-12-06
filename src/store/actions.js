import { createAction } from '@reduxjs/toolkit';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { chain_query } from 'configs/contract_calls';
// import { web3_wld } from 'configs/web3-wld';
import { ABI, ACTIONS, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
// import { from_wei } from 'utils/util';

// export your actions here

export const fetchAmountOutRequest = createAction(ACTIONS.FETCH_AMOUNT_OUT_REQUEST);

export const fetchAmountOutSuccess = createAction(ACTIONS.FETCH_AMOUNT_OUT_SUCCESS);

export const fetchAmountOutFailure = createAction(ACTIONS.FETCH_AMOUNT_OUT_FAILURE);

// asynchronous tasks here

export const fetchData = (payload) => {
  return async (dispatch) => {
    dispatch(fetchAmountOutRequest());
    try {
      let { amountIn, tokenA, tokenB } = payload;
      // const isTokenSorted = tokenA < tokenB;
      // const token0 = isTokenSorted ? tokenA : tokenB;
      // const token1 = isTokenSorted ? tokenB : tokenA;
      // const path = [token0, token1];
      let txParams = {
        chain: 2,
        contract_address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        abikind: ABI.LVSWAPV2_ROUTER,
        methodname: FUNCTION.GETAMOUNTOUT,
        // f_args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY], amountIn, path[0], path[1]],
        f_args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY], amountIn, tokenA, tokenB],
      };
      if (amountIn) {
        let resp = (await chain_query(txParams)).toString();
        console.log({ AMOUNTSOUT: resp });
        dispatch(fetchAmountOutSuccess(resp));
      } else {
        dispatch(fetchAmountOutSuccess(''));
      }
    } catch (err) {
      dispatch(fetchAmountOutFailure(err));
    }
  };
};
