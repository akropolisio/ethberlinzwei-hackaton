pragma solidity ^0.5.0;

import "./MarketInterface.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "../helpers/ERC20MintableInterface.sol";

contract MarketMock is Initializable, MarketInterface {
  mapping(address => mapping(address => uint)) public supplyBalances;
  mapping(address => mapping(address => uint)) public borrowBalances;

  mapping(address => uint ) private fakePriceOracle;
  uint public collateralRatio = 15000000000000000000;

  function initialize(address tokenAddress) public initializer  {
    _addToken(tokenAddress, 10000000000000000000); //FBTOken and base price
  }

  function borrow(address asset, uint amount) public returns (bool) {
    borrowBalances[msg.sender][asset] += amount;

    //minting
    ERC20MintableInterface(asset).mint(msg.sender, amount);

    return true;
  }

  function supply(address asset, uint amount) public returns (bool) {
    supplyBalances[msg.sender][asset] += amount;
    IERC20(asset).transferFrom(msg.sender, address(this), amount);

    return true;
  }

  function withdraw(address asset, uint amount) public returns (bool) {
    ERC20MintableInterface token = ERC20MintableInterface(asset);
    uint supplyBalance = supplyBalances[msg.sender][asset];

    uint withdrawAmount;
    if (amount == uint(-1)) {
      withdrawAmount = supplyBalance;
    } else {
      withdrawAmount = min(amount, supplyBalance);
    }

    supplyBalances[msg.sender][asset] -= withdrawAmount;
    token.transfer(msg.sender, withdrawAmount);

    return true;
  }

  function repayBorrow(address asset, uint amount) public returns (bool) {
  
    ERC20MintableInterface token = ERC20MintableInterface(asset);
    uint borrowBalance = borrowBalances[msg.sender][asset];

    uint repayAmount;
    if (amount == uint(-1)) {
      repayAmount = min(token.balanceOf(msg.sender), borrowBalance);
    } else {
      repayAmount = amount;
    }

    borrowBalances[msg.sender][asset] -= repayAmount;
    token.transferFrom(msg.sender, address(this), repayAmount);

    token.burn(token.balanceOf(address(this)));

    return true;
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

  function calculateAccountValues(address account) public view returns (bool, uint, uint) {
    uint totalBorrowInEth = 0;
    uint totalSupplyInEth = 0;
    for (uint i = 0; i < collateralMarkets.length; i++) {
      address asset = collateralMarkets[i];
      totalBorrowInEth += ( borrowBalances[account][asset] * fakePriceOracle[asset] );
      totalSupplyInEth += ( supplyBalances[account][asset] * fakePriceOracle[asset] );
    }
    return (true, totalSupplyInEth, totalBorrowInEth);
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
