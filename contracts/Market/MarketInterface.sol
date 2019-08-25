pragma solidity ^0.5.0;

contract MarketInterface {
  uint public collateralRatio;
  address[] public collateralMarkets;

  function borrow(address account, address asset, address weth, uint amount) public returns (bool);

  function supply(address asset, uint amount) public returns (bool);

  function withdraw(address asset, uint requestedAmount) public returns (bool);

  function repayBorrow(address asset, uint amount) public returns (bool);

  function getSupplyBalance(address account, address asset) view public returns (uint);

  function getBorrowBalance(address account, address asset) view public returns (uint);

  function assetPrices(address asset) view public returns (uint);

  function calculateAccountValues(address account) view public returns (bool, uint, uint);
}
