import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const RPC_URLS = {
  137: "https://polygon-rpc.com/",
};

export const injected = new InjectedConnector({
  supportedChainIds: [137],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 137: RPC_URLS[137] },
  qrcode: true,
});
