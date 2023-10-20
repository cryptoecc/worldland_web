export declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc;
    web3: any;
    myData: any;
  }
  interface SwapInputTabProps {
    loader: boolean;
    input: string;
    output: string;
    open: Function;
    inputHandler: (field: Field, typedValue: string) => void;
    selectedToken: any;
    selected2Token: any;
    openModalForFirstInput: any;
    openModalForSecondInput: any;
    spotlightToken: TokenProps;
    btnState: number;
    disabled: boolean;
    funcExec: () => void;
  }

  interface AiSwapProps {
    loader: boolean;
    input: string;
    output: string;
    setInputHandler: (field: Field, value: string) => void;
    spotlightToken: TokenProps;
    btnState: number;
    disabled: boolean;
    funcExec: () => void;
  }

  interface TokenModalProps {
    close: Function;
    handleTokenClick: React.Dispatch<React.SetStateAction<any>>;
  }

  interface IRemoveLiquidity {
    close: Function;
    allowance: string;
    handleApprove: () => void;
    selectedPair?: Pair;
  }

  interface BackdropProps {
    close?: Function;
    intensity: number;
  }

  interface TokenProps {
    symbol: string;
    title: string;
    icon: string;
    amount: string;
    address: `0x${string}`;
  }

  interface selectedCrypto {}

  interface ImapIndexToFunction {
    [key: number]: (obj: TokenProps) => void;
  }
  interface ImapIndexToInput {
    [key: number]: (amount: string) => void;
  }

  interface ImapMessageToObject {
    [key: number]: ((token: TokenProps) => void) | string;
  }

  interface ImapPairToBalance {
    [key: `0x${string}`]: Pair;
  }

  interface Pair {
    balance?: string;
    address?: `0x${string}`;
  }

  interface ImapPair {
    result: string;
  }

  // types

  type ADDRESS_TYPE = {
    [key: string]: `0x${string}` | any;
  };

  type chainids = {
    [key: string]: number;
  };
}
