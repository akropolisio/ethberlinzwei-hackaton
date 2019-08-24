pragma solidity ^0.5.0;


import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "../helpers/ERC20MintableInterface.sol";

import "chainlink/v0.5/contracts/ChainlinkClient.sol";

contract Market is Initializable, ChainlinkClient  {
  address[] public collateralMarkets;

  mapping(address => mapping(address => uint)) public supplyBalances;
  mapping(address => mapping(address => uint)) public borrowBalances;

  mapping(address => uint ) private tokenPriceOracle;

  uint256 constant private oraclePayment = 1 * LINK;
  uint256 public ethCurrentPrice;

  uint public collateralRatio;
  address link;
  address oracle;

  function initialize(address _tokenAddress) public initializer  {

    link = 0xa36085F69e2889c224210F603D836748e7dC0088;

    oracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e;

    collateralRatio = 15000000000000000000;

    //_addToken(_tokenAddress, priceInWeth);

    setChainlinkToken(link);
    setChainlinkOracle(oracle);
  }

  function requestETHPrice(bytes32 _jobId) public {
    requestCoinMarketCapPrice(oracle, _jobId, "ETH", "USD");
  }
  function requestCoinMarketCapPrice (address _oracle, bytes32 _jobId, string memory _coin, string memory _market) private {
      Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
      req.add("sym", _coin);
      req.add("convert", _market);
      string[] memory path = new string[](5);
      path[0] = "data";
      path[1] = _coin;
      path[2] = "quote";
      path[3] = _market;
      path[4] = "price";
      req.addStringArray("copyPath", path);
      req.addInt("times", 100);
      sendChainlinkRequestTo(_oracle, req, oraclePayment);
  }

  function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId) {
      ethCurrentPrice = _price;
  }

  function borrow(address asset, uint amount) public returns (bool) {
    borrowBalances[msg.sender][asset] += amount;

    //minting
    ERC20MintableInterface(asset).mint(msg.sender, amount);

    return true;
  }

  function supply(address asset, uint amount) public returns (bool) {
    supplyBalances[msg.sender][asset] += amount;
    ERC20MintableInterface(asset).transferFrom(msg.sender, address(this), amount);

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
    return tokenPriceOracle[asset];
  }

  function calculateAccountValues(address account) public view returns (bool, uint, uint) {
    uint totalBorrowInEth = 0;
    uint totalSupplyInEth = 0;
    for (uint i = 0; i < collateralMarkets.length; i++) {
      address asset = collateralMarkets[i];
      totalBorrowInEth += ( borrowBalances[account][asset] * tokenPriceOracle[asset] );
      totalSupplyInEth += ( supplyBalances[account][asset] * tokenPriceOracle[asset] );
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
    //fakePriceOracle[tokenAddress] = priceInWeth;
  }

  function min(uint a, uint b) internal pure returns (uint) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  }
}
