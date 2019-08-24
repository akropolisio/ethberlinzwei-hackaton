import React from 'react';
import styled from 'styled-components';

import loader from '../../assets/loader.svg';

const Loader = () => {
  return (
    <div className="loader">
      <Img src={loader} />
      <h3> Loading Web3, accounts, and contract...</h3>
      <p> Unlock your metamask </p>
    </div>
  );
};

const Img = styled.img`
  width: 70px;
  heigth: 70px;
`;

export default Loader;
