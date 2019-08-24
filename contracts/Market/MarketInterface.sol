pragma solidity ^0.5.0;

contract MarketInterface {
  uint public collateralRatio;

  function borrow(address asset, uint amount) public returns (uint);

  function supply(address asset, uint amount) public returns (uint);

  function withdraw(address asset, uint requestedAmount) public returns (uint);

  function repayBorrow(address asset, uint amount) public returns (uint);

  function getSupplyBalance(address account, address asset) view public returns (uint);

  function getBorrowBalance(address account, address asset) view public returns (uint);

  function assetPrices(address asset) view public returns (uint);

  function calculateAccountValues(address account) view public returns (uint, uint, uint);
}