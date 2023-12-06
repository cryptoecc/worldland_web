import { createAction } from '@reduxjs/toolkit';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { chain_query } from 'configs/contract_calls';
import { web3_wld } from 'configs/web3-wld';
import { ABI, ACTIONS, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
import { from_wei } from 'utils/util';

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
      console.log({ tokenA, tokenB });
      const blockNumber = await web3_wld.eth.getBlockNumber();
      let getPairTx = {
        chain: 2,
        contract_address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
        abikind: ABI.LVSWAPV2_FACTORY,
        methodname: FUNCTION.GETPAIR,
        f_args: [tokenA, tokenB],
      };
      console.log('CURRENT_PAIR', await chain_query(getPairTx));
      let marketPriceTx = {
        chain: 2,
        contract_address: await chain_query(getPairTx),
        abikind: ABI.LVSWAPV2_PAIR,
        methodname: FUNCTION.GETMARKETPRICE,
        f_args: [blockNumber],
      };
      console.log('CURRENT_MARKET_PRICE', await chain_query(marketPriceTx));
      if (amountIn) {
        let amountOut = (parseFloat(amountIn) * parseFloat(from_wei(await chain_query(marketPriceTx)))).toString();
        dispatch(fetchAmountOutSuccess(amountOut));
      } else {
        dispatch(fetchAmountOutSuccess(''));
      }
    } catch (err) {
      dispatch(fetchAmountOutFailure(err));
    }
  };
};
