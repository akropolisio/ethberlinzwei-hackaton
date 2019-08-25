import React, { Component } from 'react';
import getWeb3, { getGanacheWeb3 } from './utils/getWeb3';
import styled from 'styled-components';
import Box from '3box';

import abi from './assets/abi.json';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './assets/index.css';
import { Background, Orders, About, Balance, Loader, Chat } from './components';

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    thread: null,
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
    let CDP = {};
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

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const networkType = await web3.eth.net.getNetworkType();
      const isMetaMask = web3.currentProvider.isMetaMask;

      //3box
      let thread;
      try {
        const box = await Box.openBox(accounts[0], web3.currentProvider);
        const space = await box.openSpace(accounts[0]);
        thread = await space.joinThread('unisaur-thread');
        thread.onUpdate(upd => console.log('thread updated'));
      } catch (e) {
        console.log('failed to init 3box message chat');
      }

      let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]) : web3.utils.toWei('0');
      balance = web3.utils.fromWei(balance, 'ether');
      CDP = new web3.eth.Contract(abi, '0x98E35E5063e49a10Ec039aBB14426dB1903EA870');

      if (CDP) {
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({
          web3,
          CDP,
          thread,
          ganacheAccounts,
          accounts,
          balance,
          networkId,
          networkType,
          isMetaMask,
        });
      } else {
        this.setState({
          web3,
          thread,
          ganacheAccounts,
          accounts,
          balance,
          networkId,
          networkType,
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

  render() {
    let { accounts, balance, thread, CDP, web3 } = this.state;

    return !this.state.web3 ? (
      <Loader />
    ) : (
      <Tabs>
        <TabList>
          <Tab>About</Tab>
          <Tab>Balance</Tab>
          <Tab>Orders</Tab>
        </TabList>

        <TabPanel>
          <H1>
            Unisaur.cz is DEX+Money Market where you can create and trade Facebook-priced tokens (or any other assets
            from NASDAQ/NYCE/etc){' '}
          </H1>
          <About />
        </TabPanel>
        <TabPanel>
          <h2>Your balances</h2>
          <Balance web3={web3} CDP={CDP} address={accounts[0]} balance={balance} />
        </TabPanel>
        <TabPanel>
          <Background />
          <Orders />
        </TabPanel>
        <Chat thread={thread} />
      </Tabs>
    );
  }
}

const H1 = styled.h1`
  z-index: 1;
  color: green;
`;

export default App;
