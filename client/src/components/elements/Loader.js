import React from 'react';
import styled from 'styled-components';

import loader from '../../assets/loader.svg';

const Loader = () => {
  return (
    <LoaderBack className="loader">
      <Img src={loader} />
      <h3> Loading Web3, accounts, and contract...</h3>
      <p> Unlock your metamask </p>
    </LoaderBack>
  );
};

const Img = styled.img`
  width: 70px;
  heigth: 70px;
`;

const LoaderBack = styled.div`
  z-index: 1;
  position: fixed;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 40px 0;
  top: 0;
  background-color: #fff8;
`;

export default Loader;
