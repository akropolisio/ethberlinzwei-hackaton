pragma solidity ^0.5.0;

contract MarketInterface {
  uint public collateralRatio;
  address[] public collateralMarkets;


  function currentCollateralRatio() public view returns(uint256);

  function setCollateralRatio(uint256 ratio) public;

  function ethPrice() public view returns(uint256);

  function setEthPrice(uint256 price) public;

  function setAssetPrice(uint256 price, address asset) public;
  
  function assetPrice(address asset) public view returns(uint256);

  function ethCurrentPriceCount(uint amount, address account, address weth) public view returns (uint256);

  function fbCurrentPriceCount(uint amount, address account, address asset) public view returns (uint256);

  function borrow(address account, address asset, address weth, uint amount) public returns (bool);

  function supply(address asset, uint amount) public returns (bool);

  function withdraw(address asset, uint requestedAmount) public returns (bool);

  function repayBorrow(address asset, uint amount) public returns (bool);

  function getSupplyBalance(address account, address asset) view public returns (uint);

  function getBorrowBalance(address account, address asset) view public returns (uint);

  function assetPrices(address asset) view public returns (uint);

  function calculateAccountValues(address account) view public returns (bool, uint, uint);
}
