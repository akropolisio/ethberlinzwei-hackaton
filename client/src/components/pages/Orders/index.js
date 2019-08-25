import React from 'react';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <iframe
        title="0x-marketplace"
        src="https://akropolisio.github.io/0x-launch-kit-frontend/#/erc20"
        frameBorder="0"
        style={{ width: '100%', height: 'calc(100vh - 45px)' }}
      ></iframe>
    );
  }
}

export default Orders;
