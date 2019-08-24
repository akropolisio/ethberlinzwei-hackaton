pragma solidity ^0.5.0;

import "./MarketInterface";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";

contract MarketMock is Initializable, MarketInterface {
  mapping(address => mapping(address => uint)) public supplyBalances;
  mapping(address => mapping(address => uint)) public borrowBalances;

  mapping(address => uint ) private fakePriceOracle;
  uint public collateralRatio = 15000000000000000000;

  function initialize(address tokenAddress) public initializer  {
    _addToken(tokenAddress, 10000000000000000000); //FBTOken and base price
  }

  function borrow(address asset, uint amount) public returns (uint) {
    borrowBalances[msg.sender][asset] += amount;

    //minting

    IERC20(asset).transfer(msg.sender, amount);

    return 1;
  }

  function supply(address asset, uint amount) public returns (uint) {
    supplyBalances[msg.sender][asset] += amount;
    IERC20(asset).transferFrom(msg.sender, address(this), amount);

    return 1;
  }

  function withdraw(address asset, uint amount) public returns (uint) {
    EIP20Interface token = IERC20(asset);
    uint supplyBalance = supplyBalances[msg.sender][asset];

    uint withdrawAmount;
    if (amount == uint(-1)) {
      withdrawAmount = supplyBalance;
    } else {
      withdrawAmount = min(amount, supplyBalance);
    }

    supplyBalances[msg.sender][asset] -= withdrawAmount;
    token.transfer(msg.sender, withdrawAmount);

    return 1;
  }

  function repayBorrow(address asset, uint amount) public returns (uint) {
  
    EIP20Interface token = IERC20(asset);
    uint borrowBalance = borrowBalances[msg.sender][asset];

    uint repayAmount;
    if (amount == uint(-1)) {
      repayAmount = min(token.balanceOf(msg.sender), borrowBalance);
    } else {
      repayAmount = amount;
    }

    borrowBalances[msg.sender][asset] -= repayAmount;
    token.transferFrom(msg.sender, address(this), repayAmount);

    return 1;
  }
  // second wave

  function getSupplyBalance(address account, address asset) view public returns (uint) {
    return supplyBalances[account][asset];
  }

  function getBorrowBalance(address account, address asset) view public returns (uint) {
    return borrowBalances[account][asset];
  }

  // third wave

  function assetPrices(address asset) public view returns (uint) {
    return fakePriceOracle[asset];
  }

  function calculateAccountValues(address account) public view returns (uint, uint, uint) {
    uint totalBorrowInEth = 0;
    uint totalSupplyInEth = 0;
    for (uint i = 0; i < collateralMarkets.length; i++) {
      address asset = collateralMarkets[i];
      totalBorrowInEth += ( borrowBalances[account][asset] * fakePriceOracle[asset] );
      totalSupplyInEth += ( supplyBalances[account][asset] * fakePriceOracle[asset] );
    }
    return (1, totalSupplyInEth, totalBorrowInEth);
  }

  /* @dev very loose interpretation of some admin and price oracle functionality for helping unit tests, not really in the money market interface */
  function _addToken(address tokenAddress, uint priceInWeth) public {
    for (uint i = 0; i < collateralMarkets.length; i++) {
      if (collateralMarkets[i] == tokenAddress) {
        return;
      }
    }
    collateralMarkets.push(tokenAddress);
    fakePriceOracle[tokenAddress] = priceInWeth;
  }

  function min(uint a, uint b) internal pure returns (uint) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  }
}
