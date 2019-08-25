import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';

import { test_orders } from '../../../utils';
import { Background } from '../../elements';
import CreateOrder from './CreateOrder';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid container spacing={4} direction="column">
        <Background />
        <Grid item spacing={4}>
          <CreateOrder />
        </Grid>
        <Grid item>
          <OrderTables>
            <OrderTable>
              <Header>
                <tr>
                  <th>Size</th>
                  <th>Bid</th>
                </tr>
              </Header>
              <TBody>
                {test_orders.sell.map((el, i) => (
                  <Order key={i}>
                    <OSize>{el.size}</OSize>
                    <OPrice color={'green'}>{el.price}</OPrice>
                  </Order>
                ))}
              </TBody>
            </OrderTable>
            <OrderTable>
              <Header>
                <tr>
                  <th>Size</th>
                  <th>Bid</th>
                </tr>
              </Header>
              <TBody>
                {test_orders.buy.map((el, i) => (
                  <Order key={i}>
                    <OSize>{el.size}</OSize>
                    <OPrice color={'red'}>{el.price}</OPrice>
                  </Order>
                ))}
              </TBody>
            </OrderTable>
          </OrderTables>
        </Grid>
      </Grid>
    );
  }
}

const Order = styled.tr`
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
`;

const OSize = styled.td`
  width: 18%;
`;
const OPrice = styled.td`
  width: 82%;
  color: ${({ color }) => (color && color) || '#000'};
`;

const OrderTables = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  text-transform: uppercase;
  justify-content: center;
`;

const OrderTable = styled.table``;

const TBody = styled.tbody``;

const Header = styled.thead``;

export default Orders;
