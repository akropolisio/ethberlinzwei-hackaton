import React from 'react';
import styled from 'styled-components';
import { Form as FinalForm, Field as FinalField } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Grid, Dialog, Button } from '@material-ui/core';
import '../../assets/index.css';

const KyberWidget = ({ isOpen, balance, closeModal, handleDeposit, network }) => {
  const _handleFormSubmit = React.useCallback(e => handleDeposit(e), []);

  return (
    <Dialog open={isOpen} padding={1}>
      <Button className="txt_c" onClick={() => closeModal(false)} xs={2} variant="contained" color="primary">
        x
      </Button>

      <FinalForm onSubmit={_handleFormSubmit}>
        {({ handleSubmit, submitting, pristine }) => (
          <Grid container onSubmit={handleSubmit} justify="center">
            <Grid item>
              <Text>Enter amount of ETH you want to add:</Text>
            </Grid>
            <Grid item>
              <Grid component="form" container onSubmit={handleSubmit} width="100%">
                <Grid item spacing={4}>
                  <FinalField name="ETH" component={TextField} placeholder={balance} />
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    >
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Text> Want more? Use Kyber to swap ERC20 to ETH! </Text>
            </Grid>
          </Grid>
        )}
      </FinalForm>
      <Grid onClick={closeModal}>
        <Button>Cancel</Button>
        <Widget network={network} />
      </Grid>
    </Dialog>
  );
};

const Widget = ({ network }) => {
  const link = `https://widget.kyber.network/v0.7.1/?type=swap&mode=iframe&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=${network ||
    'kovan'}&lang=en&defaultPair=ETH_DAI`;
  return (
    <KyberLink
      href={link}
      className="kyber_widget"
      name="KyberWidget - Powered by KyberNetwork"
      title="Pay with tokens"
      target="for_widget"
    >
      Swap tokens for more
    </KyberLink>
  );
};

const KyberLink = styled.a`
  display: inline-block;
  text-align: center;
  text-decoration: none;
  background-size: auto 26px;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  border-radius: 3px;
  font-weight: 600;
  padding: 15px 20px;
  margin-left: 1em;
  max-width: 100%;
  background-color: #00a2bc;
  color: #f8f8f8;
  transition: background-color 0.3s;

  &:hover {
    background-color: #02c2e0;
  }

  &:active {
    top: 1px;
  }
`;

export const Text = styled.p`
  text-align: center;
`;

export default KyberWidget;
