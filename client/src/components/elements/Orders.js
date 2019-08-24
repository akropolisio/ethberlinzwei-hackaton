import React from 'react';
import styled from 'styled-components';

import { test_orders } from '../../utils';

class Orders extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
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
