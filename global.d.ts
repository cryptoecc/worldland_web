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

  interface TokenModalProps {
    close: Function;
    handleTokenClick: React.Dispatch<React.SetStateAction<any>>;
  }

  interface BackdropProps {
    close?: Function;
    intensity: number;
  }

  interface selectedCrypto {}

  type ADDRESS_TYPE = {
    [key: string]: `0x${string}` | any;
  };

  type chainids = {
    [key: string]: number;
  };
}
