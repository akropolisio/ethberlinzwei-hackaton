import React from 'react';
import styled from 'styled-components';
import { PublicAddress } from 'rimble-ui';
import { Form as FinalForm, Field as FinalField } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Grid, Button } from '@material-ui/core';

import { KyberWidget } from '../elements';

class Balance extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isOpen: false,
    };
  }

  handleDeposit = () => this.setState({ isOpen: true });
  handleWithdraw = e => console.log('Withdraw Unimplemented', e);
  handlePayback = e => console.log('Payback Unimplemented', e);
  handleGenerate = e => console.log('Generate Unimplemented', e);

  closeModal = () =>
    this.setState({
      isOpen: false,
    });

  render() {
    let { address, balance } = this.props;
    const { isOpen } = this.state;
    return (
      <BalancesContainer>
        <Grid container justify="space-around" alignItems="center">
          <Grid item xs={2}>
            <PublicAddress label="Ethereum" address={address} />
          </Grid>
          <Grid item xs={2}>
            {balance} ETH
          </Grid>
          <Grid item xs={4}>
            <Form handleSubmit={this.handleDeposit} text="Deposit" />
          </Grid>
          <Grid item xs={4}>
            <Form handleSubmit={this.handleWithdraw} text="Withdraw" />
          </Grid>
        </Grid>
        <Grid container justify="space-around" alignItems="center">
          <Grid item xs={2}>
            FBToken
          </Grid>
          <Grid item xs={2}>
            0 FB
          </Grid>
          <Grid item xs={4}>
            <Form handleSubmit={this.handlePayback} text="Payback" />
          </Grid>
          <Grid item xs={4}>
            <Form handleSubmit={this.handleGenerate} text="Generate" />
          </Grid>
        </Grid>

        <KyberWidget isOpen={isOpen} balance={balance} closeModal={this.closeModal} />
        <FrameForKyber name="for_widget"></FrameForKyber>
        <script async src="https://widget.kyber.network/v0.7.1/widget.js"></script>
      </BalancesContainer>
    );
  }
}

const Form = ({ handleSubmit, text }) => {
  return (
    <FinalForm onSubmit={handleSubmit}>
      {({ handleSubmit, submitting, pristine }) => (
        <Grid component="form" direction="row" container onSubmit={handleSubmit} width="100%">
          <Grid item>
            <FinalField name="message" component={TextField} />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              {text}
            </Button>
          </Grid>
        </Grid>
      )}
    </FinalForm>
  );
};

const BalancesContainer = styled.main`
  margin: 2em;
  font-weight: 600;
  position: relative;
`;
const FrameForKyber = styled.iframe`
  border: none;
  width: 100%;
  height: 100vh;
`;
export default Balance;
