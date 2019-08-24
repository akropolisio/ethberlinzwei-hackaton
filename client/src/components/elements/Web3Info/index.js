import React, { Component } from 'react';
import { PublicAddress, Blockie } from 'rimble-ui';
import './Web3Info.css';

export default class Web3Info extends Component {
  renderNetworkName(networkId) {
    switch (networkId) {
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 1:
        return 'Main';
      case 42:
        return 'Kovan';
      default:
        return 'Private';
    }
  }

  render() {
    const { networkId, accounts, balance, isMetaMask } = this.props;
    return (
      <div className={'web3'}>
        <h3> Your Web3 Info </h3>
        <div className={'dataPoint'}>
          <div className={'label'}>Network:</div>
          <div className={'value'}>
            {networkId} - {this.renderNetworkName(networkId)}
          </div>
        </div>
        <div className={'dataPoint'}>
          <div className={'label'}>Your address:</div>
          <div className={'value'}>
            <PublicAddress address={accounts[0]} />
            <Blockie opts={{ seed: accounts[0], size: 15, scale: 3 }} />
          </div>
        </div>
        <div className={'dataPoint'}>
          <div className={'label'}>Your ETH balance:</div>
          <div className={'value'}>{balance}</div>
        </div>
        <div className={'dataPoint'}>
          <div className={'label'}>Using Metamask:</div>
          <div className={'value'}>{isMetaMask ? 'YES' : 'NO'}</div>
        </div>
      </div>
    );
  }
}
