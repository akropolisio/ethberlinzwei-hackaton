import React from 'react';
import styled from 'styled-components';

import { Triangle, Circle, Angle } from '../elements';
import { colors } from '../../utils';

class About extends React.Component {
  renderTriangles = () => {
    return Array.from(Array(50)).map((el, i) => {
      let top = Math.ceil(Math.random() * 90);
      let left = Math.ceil(Math.random() * 90);
      let w = Math.ceil(Math.random() * 200);
      let h = w;
      let color = Math.ceil(Math.random() * colors.length - 1);
      return <Triangle key={i} top={top} left={left} w={w} h={h} color={colors[color]} />;
    });
  };
  renderCircles = () => {
    return Array.from(Array(15)).map((el, i) => {
      let top = Math.ceil(Math.random() * 90);
      let left = Math.ceil(Math.random() * 90);
      let w = Math.ceil(Math.random() * 100);
      let h = w;
      let color = Math.ceil(Math.random() * colors.length - 1);
      return <Circle key={i} top={top} left={left} w={w} h={h} color={colors[color]} />;
    });
  };
  renderAngles = () => {
    return Array.from(Array(50)).map((el, i) => {
      let top = Math.ceil(Math.random() * 90);
      let left = Math.ceil(Math.random() * 90);
      let w = 1 + Math.ceil(Math.random() * 10);
      let h = 5 + Math.ceil(Math.random() * 400);
      let color = Math.ceil(Math.random() * colors.length - 1);
      let rotate = -5 - Math.ceil(Math.random() * 300);

      return <Angle key={i} top={top} left={left} w={w} h={h} color={colors[color]} rotate={rotate} />;
    });
  };

  render() {
    return (
      <Relative>
        {this.renderTriangles()}
        {this.renderCircles()}
        {this.renderAngles()}
      </Relative>
    );
  }
}

const Relative = styled.main`
  position: relative;
  z-index: -1;
  opacity: 0.3;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
`;

export default About;
