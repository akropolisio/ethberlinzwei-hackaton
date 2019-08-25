pragma solidity ^0.5.0;


import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "../helpers/ERC20MintableInterface.sol";

import "chainlink/v0.5/contracts/ChainlinkClient.sol";

contract Market is Initializable, ChainlinkClient  {
  address[] public collateralMarkets;

  mapping(address => mapping(address => uint)) public supplyBalances;
  mapping(address => mapping(address => uint)) public borrowBalances;


  uint256 constant private oraclePayment = 1 * LINK;
  uint256 private ethCurrentPrice;
  mapping(address => uint) public tokenPriceOracle;

  uint private collateralRatio;
  address link;
  address oracle;

  function initialize(address _tokenAddress) public initializer  {

    //set link
    link = 0xa36085F69e2889c224210F603D836748e7dC0088;
     
    //set oracle
    oracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e;

    collateralRatio = 150;

    setChainlinkToken(link);
    setChainlinkOracle(oracle);

    ethCurrentPrice = 18860;
  
    tokenPriceOracle[_tokenAddress] = 17777;

  }

  function currentCollateralRatio() public view returns(uint256) {
    return collateralRatio;
  }

  function setCollateralRatio(uint256 ratio) public {
    collateralRatio = ratio;
  }

  function ethPrice() public view returns(uint256) {
    return ethCurrentPrice;
  }

  function setEthPrice(uint256 price) public {
    ethCurrentPrice = price;
  }

  function setAssetPrice(uint256 price, address asset) public {
    tokenPriceOracle[asset] = price;
  }
  
  function assetPrice(address asset) public view returns(uint256) {
    return tokenPriceOracle[asset];
  }

  function ethCurrentPriceCount(address account, address weth) public view returns (uint256) {
    uint eth = getSupplyBalance(account, weth)*ethCurrentPrice*100; //eth in usd
    return eth;
  }

  function fbCurrentPriceCount(uint amount, address account, address asset) public view returns (uint256) {
    uint fb = (getBorrowBalance(account, asset)+amount)*assetPrice(asset)*150; //facebook in usd
    return fb;
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

  function borrow(address account, address asset, address weth, uint amount) public returns (bool) {

    uint eth = ethCurrentPriceCount(account, weth);

    uint fb = fbCurrentPriceCount(amount, account, asset);
  
    require(eth >= fb, "not mint tokens");

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
      withdrawAmount = 0; //min(amount, supplyBalance);
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

   function min(uint a, uint b) internal pure returns (uint) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  }

}
