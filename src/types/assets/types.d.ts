// interface Window {
//   ethereum?: {
//     isMetaMask?: true;
//     request?: (...args: any[]) => Promise<void>;
//   };
// }
declare global {
  interface Window {
    ethereum: any;
  }
}

declare module '*.mp4';
