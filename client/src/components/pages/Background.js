import React from 'react';

import Memes from './Memes';

let move_interval;

class Background extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mx: window.innerWidth / 2,
      my: window.innerHeight / 2,
    };
  }

  componentDidMount() {
    move_interval = setInterval(
      () =>
        this.setState({
          mx: this.state.mx + 100,
          my: this.state.my + 100,
        }),
      1000,
    );
  }
  componentWillUnmount() {
    clearInterval(move_interval);
  }

  // static getDerivedStateFromProps(props, prevState) {
  //   if (prevState.mx !== props.x || prevState.my !== props.y) {
  //     let x = props.x,
  //       y = props.y;
  //     return { x, y };
  //   }

  //   return null;
  // }

  render() {
    const { mx, my } = this.props;

    return (
      <Memes onMouseMove={e => this.onMouseMove(e)} x={mx} y={my}>
        {this.props.children}
      </Memes>
    );
  }
}

export default Background;
