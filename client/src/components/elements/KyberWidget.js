import React from 'react';
import styled from 'styled-components';
import { TextField } from 'final-form-material-ui';
import { Grid, Dialog, Card, Button, Box } from '@material-ui/core';

const KyberWidget = ({ isOpen, balance, closeModal, network }) => {
  return (
    <Dialog open={isOpen}>
      <Button onClick={() => closeModal(false)} variant="contained" color="primary">
        x
      </Button>

      <Grid>
        <Grid>
          <Text>Enter amount of ETH you want to add:</Text>
        </Grid>
        <Grid item>
          <TextField name="ETH" label="ETH" />
        </Grid>
        <Text> Or </Text>
      </Grid>
      <Grid onClick={closeModal}>
        <Button>Cancel</Button>
        <Widget network={network} />
      </Grid>
    </Dialog>
  );
};

const Widget = ({ network }) => {
  console.log('network', network);
  const link = `https://widget.kyber.network/v0.7.1/?type=swap&mode=iframe&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=${network ||
    'ropsten'}&lang=en&defaultPair=ETH_DAI`;
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

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Text = styled.p`
  text-align: center;
`;

export default KyberWidget;
