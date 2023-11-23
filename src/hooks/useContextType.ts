import { Provider } from 'types/select';
import { useBridgeContext } from 'contexts/BridgeProvider';
import { useSwapContext } from 'contexts/SwapProvider';

export const useContextType = (provider: Provider) => {
  const swapContext = useSwapContext();
  const bridgeContext = useBridgeContext();

  switch (provider) {
    case 'Swap':
      return swapContext;
    case 'Bridge':
      return bridgeContext;
    default:
      throw new Error('Invalid provider');
  }
};
