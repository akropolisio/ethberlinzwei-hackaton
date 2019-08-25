import React from 'react';
import styled from 'styled-components';
import '../../assets/animations.css';
import { memes } from '../../utils';

const Memes = () => {
  return (
    <Playground>
      <Origin className="tooltip" />
      {memes.map((el, id) => (
        <Meme key={id} className="rotate_meme" />
      ))}
    </Playground>
  );
};

const Origin = styled.span`
  position: absolute;
  top: 30%;
  left: 50%;
  transition: 0.3s;
  width: 50px;
  height: 50px;
  background-color: rebeccapurple;
  animation: floating;
`;

const Playground = styled.div`
  top: ${props => props.y};
  left: ${props => props.x};
  display: inline-block;
  font-size: 50px;
  line-height: 50px;
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const Meme = styled.p`
  position: absolute;
  top: calc(20% - 50px);
  left: calc(40% - 50px);
  width: 200px;
  height: 200px;
`;

export default Memes;
