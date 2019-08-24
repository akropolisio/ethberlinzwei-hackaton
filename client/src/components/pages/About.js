import React from 'react';
import styled from 'styled-components';

import { Triangle, Circle, Angle } from '../elements';

class About extends React.Component {
  render() {
    return (
      <Relative>
        <Angle top={10} left={16} w={20} h={20} />
        <Angle top={20} left={46} w={40} h={40} />
        <Angle top={50} left={16} w={20} h={20} />
        <Circle top={50} left={16} />
        <Circle top={5} left={96} />
        <Circle top={25} left={80} />
        <Triangle top={30} left={56} />
        <Triangle top={10} left={20} />
        <Triangle top={60} left={80} />
      </Relative>
    );
  }
}

const Relative = styled.main`
  position: relative;
  z-index: -1;
  opacity: 0.7;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
`;

export default About;
