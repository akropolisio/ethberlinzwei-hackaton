// import React from "react";
import styled from 'styled-components';
import '../../assets/animations.css';

const Rotatable = styled.div`
  position: absolute;
  width: ${({ w }) => `${w}` || '50'}px;
  height: ${({ h }) => `${h}` || '50'}px;
  top: ${({ top }) => `${top}` || 10}%;
  left: ${({ left }) => `${left}` || 10}%;
  background-color: ${({ color }) => color || 'blue'};
`;

export const Circle = styled(Rotatable)`
  border-radius: 50%;
  animation: floating;
  transition: 3s;
`;

export const Angle = styled(Rotatable)`
  border-radius: 40px 50px 150px;
  transition: 3s;
  transform: rotate(${({ rotate }) => rotate || '-5'}deg);
  // animation: rotate 10s linear infinite;
`;

export const Triangle = styled(Rotatable)`
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 35px solid transparent;
  border-left: 60px solid ${({ color }) => color || 'blue'};
  background-color: transparent;
  transition: 3s;
  animation: ${({ key }) => (key % 2 === 0 && 'rotate') || 'rotate-rev'} 10s linear infinite;
`;

export const Line = styled(Rotatable)``;
