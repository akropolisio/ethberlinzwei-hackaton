// import React from "react";
import styled from 'styled-components';
import '../animations.css';

const Rotatable = styled.div`
  position: absolute;
  width: ${({ w }) => `${w}px` || '50px'};
  height: ${({ h }) => `${h}px` || '50px'};
  top: ${({ top }) => `${top}vh` || 10};
  left: ${({ left }) => `${left}vw` || 10};
  background-color: ${({ color }) => color || 'blue'};
`;

export const Circle = styled(Rotatable)`
  border-radius: 50%;
`;

export const Angle = styled(Rotatable)`
  border-radius: 40px 50px 150px;
  transition: 3s;
  animation: rotate 10s linear infinite;
`;

export const Triangle = styled(Rotatable)`
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 35px solid transparent;
  border-left: 60px solid green;
  background-color: white;
  transition: 3s;
  animation: rotate-rev 10s linear infinite;
`;

export const Line = styled(Rotatable)``;
