import React from 'react';
import styled from 'styled-components';
import '../../assets/animations.css';

const memes = ['Trump', 'Buffet', 'Some french guy'];

const Memes = ({ x, y }) => {
  console.log(x, y);
  return (
    <Playground x={x} y={y}>
      <Origin className="tooltip" />
      {memes.map((el, id) => (
        <Meme key={id} className="rotate_meme">
          {el}
        </Meme>
      ))}
    </Playground>
  );
};

const Origin = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transition: 0.3s;
  width: 50px;
  height: 50px;
  background-color: rebeccapurple;
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
  top: calc(50% - 50px);
  left: calc(50% - 50px);
  width: 100px;
  height: 100px;
`;

export default Memes;
