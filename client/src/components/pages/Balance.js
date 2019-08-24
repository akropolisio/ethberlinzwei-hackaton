import React from 'react';
import styled from 'styled-components';
import { PublicAddress } from 'rimble-ui';
import { colors } from '../../utils';

class Balance extends React.Component {
  render() {
    return (
      <BalancesContainer>
        <PublicAddress label="Ethereum" address="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2" />
        <PublicAddress label="FB" address="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2" />
      </BalancesContainer>
    );
  }
}

const BalancesContainer = styled.main`
  margin: 2em;
`;

export default Balance;
