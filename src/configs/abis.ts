import { abi as ETHEREUM_BRIDGE_ABI } from './contract-abi/ethereum_bridge_abi';
import { abi as POLYGON_BRIDGE_ABI } from './contract-abi/worldland_bridge_abi';
import { abi as ERC20_ABI } from './contract-abi/erc20_abi';
import { abi as UNISWAPV2_ROUTER } from './contract-abi/uniswapV2Router02';
import { abi as UNISWAPV2_PAIR } from './contract-abi/uniswapV2Pair_abi';
import { abi as UNISWAPV2_FACTORY } from './contract-abi/uniswapV2Factory_abi';
import { abi as WRAPPEDETH_ABI } from './contract-abi/wrappedeth_abi';
import { abi as BRIDGEBASE_ABI } from './contract-abi/bridgebase_abi';

//lv-swap abi

import { abi as LVSWAPV2_FACTORY } from './contract-abi/lvswapV2Factory_abi';
import { abi as LVSWAPV2_ROUTER } from './contract-abi/lvswapV2Router02_abi';
import { abi as LVSWAPV2_PAIR } from './contract-abi/lvswapV2Pair_abi';

//linear-timelock abi
import { abi as LINEAR_TIMELOCK } from './contract-abi/timelock_abi';

export const MAP_STR_ABI = {
  ETHEREUM_BRIDGE_ABI,
  POLYGON_BRIDGE_ABI,
  ERC20_ABI,
  UNISWAPV2_ROUTER,
  UNISWAPV2_PAIR,
  UNISWAPV2_FACTORY,
  WRAPPEDETH_ABI,
  LVSWAPV2_ROUTER,
  LVSWAPV2_FACTORY,
  LVSWAPV2_PAIR,
  BRIDGEBASE_ABI,
  LINEAR_TIMELOCK,
};
