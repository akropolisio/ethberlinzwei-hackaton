import { RPCSubprovider, Web3ProviderEngine, ContractWrappers } from '0x.js';
import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses';
import { HttpClient } from '@0x/connect';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { MetamaskSubprovider } from '@0x/subproviders';

export const CONFIG = {
  id: 42,
  rpcUrl: 'https://kovan.infura.io/',
  relayerUrl: 'https://api.cashflowrelay.com/v2',
  wethContract: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
  fbtContract: '0xcfd6e4044dd6e6ce64aed0711f849c7b9134d7db',
  OxContracts: getContractAddressesForNetworkOrThrow(42),
};

export function initialize0x() {
  const providerEngine = new Web3ProviderEngine();

  if (window.web3 && window.web3.currentProvider) {
    providerEngine.addProvider(new MetamaskSubprovider(window.web3.currentProvider));
  }
  providerEngine.addProvider(new RPCSubprovider(CONFIG.rpcUrl));
  providerEngine.start();

  const web3Wrapper = new Web3Wrapper(providerEngine);
  const contractWrappers = new ContractWrappers(providerEngine, {
    networkId: CONFIG.id,
  });
  const client = new HttpClient(CONFIG.relayerUrl);

  return {
    client,
    providerEngine,
    contractWrappers,
    web3Wrapper,
  };
}
