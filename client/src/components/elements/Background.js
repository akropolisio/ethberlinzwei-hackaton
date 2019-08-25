import React from 'react';
import styled from 'styled-components';
import '../../assets/animations.css';
import { memes } from '../../utils';

const Background = props => {
  return (
    <Back>
      <Memes left={true} onMouseMove={e => this.onMouseMove(e)}>
        {props.children}
      </Memes>
      <Memes onMouseMove={e => this.onMouseMove(e)}>{props.children}</Memes>
    </Back>
  );
};

const Memes = () => {
  return (
    <Playground>
      {memes.map((el, id) => (
        <Meme key={id} className="rotate_meme" />
      ))}
    </Playground>
  );
};

const Back = styled.main`
  position: absolute;
  width: 100vw;
  height: 100vh;
`;

const Playground = styled.div`
  top: ${props => props.y};
  left: ${props => props.x};
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Meme = styled.p`
  position: absolute;
  top: calc(20% - 50px);
  right: calc(20% - 50px);
  ${({ left }) => left && 'left: calc(20% - 50px);'}
  width: 70px;
  height: 70px;
`;
export default Background;
