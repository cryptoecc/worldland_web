export declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc;
    web3: any;
    myData: any;
  }
  interface SwapInputTabProps {
    input: string;
    output: string;
    open: Function;
    inputHandler: (field: Field, typedValue: string) => void;
    selectedToken: any;
    selected2Token: any;
    openModalForFirstInput: any;
    openModalForSecondInput: any;
  }

  interface AiSwapProps {
    input: string;
    output: string;
    setInputHandler: (field: Field, value: string) => void;
  }

  interface TokenModalProps {
    close: Function;
    handleTokenClick: React.Dispatch<React.SetStateAction<any>>;
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
    [key: `0x${string}`]: string;
  }

  interface ImapPair {
    result: string;
  }

  type ADDRESS_TYPE = {
    [key: string]: `0x${string}` | any;
  };

  type chainids = {
    [key: string]: number;
  };
}
