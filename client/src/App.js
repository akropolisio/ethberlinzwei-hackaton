import React, { Component } from 'react';
import getWeb3, { getGanacheWeb3 } from './utils/getWeb3';
import { Loader } from 'rimble-ui';
import { solidityLoaderOptions } from '../config/webpack';
// ^openzeppelin starter kit defaults

import Box from '3box';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './assets/index.css';
import { Background, Orders, About, Balance } from './components';

import { Button } from '@material-ui/core';

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    route: window.location.pathname.replace('/', ''),
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  };

  componentDidMount = async () => {
    const hotLoaderDisabled = solidityLoaderOptions.disabled;
    let Counter = {};
    let Wallet = {};
    try {
      Counter = require('../../contracts/Counter.sol');
      Wallet = require('../../contracts/Wallet.sol');
    } catch (e) {
      console.log(e);
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      let ganacheAccounts = [];
      try {
        ganacheAccounts = await this.getGanacheAddresses();
      } catch (e) {
        console.log('Ganache is not running');
      }
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log('accounts', accounts);
      const user = await Box.getProfile(accounts[0]);
      console.log('user', user);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const networkType = await web3.eth.net.getNetworkType();
      const isMetaMask = web3.currentProvider.isMetaMask;

      const box = await Box.openBox(accounts[0], web3.currentProvider);

      console.log('box', box);

      let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]) : web3.utils.toWei('0');
      console.log('balance', balance);
      balance = web3.utils.fromWei(balance, 'ether');
      let instance = null;
      let instanceWallet = null;
      let deployedNetwork = null;
      // if (Counter.networks) {
      //   deployedNetwork = Counter.networks[networkId.toString()];
      //   if (deployedNetwork) {
      //     instance = new web3.eth.Contract(Counter.abi, deployedNetwork && deployedNetwork.address);
      //   }
      // }
      // console.log(instance);
      // if (Wallet.networks) {
      //   deployedNetwork = Wallet.networks[networkId.toString()];
      //   if (deployedNetwork) {
      //     instanceWallet = new web3.eth.Contract(Wallet.abi, deployedNetwork && deployedNetwork.address);
      //   }
      // }
      if (instance || instanceWallet) {
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState(
          {
            web3,
            ganacheAccounts,
            accounts,
            balance,
            networkId,
            networkType,
            hotLoaderDisabled,
            isMetaMask,
            contract: instance,
            wallet: instanceWallet,
          },
          () => {
            this.refreshValues(instance, instanceWallet);
            setInterval(() => {
              this.refreshValues(instance, instanceWallet);
            }, 5000);
          },
        );
      } else {
        this.setState({
          web3,
          ganacheAccounts,
          accounts,
          balance,
          networkId,
          networkType,
          hotLoaderDisabled,
          isMetaMask,
        });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  refreshValues = (instance, instanceWallet) => {
    if (instance) {
      this.getCount();
    }
    if (instanceWallet) {
      this.updateTokenOwner();
    }
  };

  getCount = async () => {
    const { contract } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getCounter().call();
    // Update state with the result.
    this.setState({ count: response });
  };

  updateTokenOwner = async () => {
    const { wallet, accounts } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await wallet.methods.owner().call();
    // Update state with the result.
    this.setState({ tokenOwner: response.toString() === accounts[0].toString() });
  };

  renderLoader() {
    return (
      <div className="loader">
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  render() {
    return !this.state.web3 ? (
      this.renderLoader()
    ) : (
      <Tabs>
        <TabList>
          <Tab>About</Tab>
          <Tab>Balance</Tab>
          <Tab>Memes</Tab>
          <Tab>Orders</Tab>
        </TabList>

        <TabPanel>
          <Button variant="contained" color="primary">
            qweqwe
          </Button>
          <h2>About</h2>
          <About />
        </TabPanel>
        <TabPanel>
          <h2>Your balances</h2>
          <Balance />
        </TabPanel>
        <TabPanel>
          <h2>Meme driven development</h2>
          <Background />
        </TabPanel>
        <TabPanel>
          <h2>Open Orders</h2>
          <Orders />
        </TabPanel>
      </Tabs>
    );
  }
}

export default App;
