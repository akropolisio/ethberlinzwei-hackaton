pragma solidity ^0.5.0;


import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./helpers/WrappedEtherInterface.sol";
import "./Market/MarketInterface.sol";

contract FBCDP is Initializable {
  using SafeMath for uint;
  uint constant expScale = 10**18;
  uint constant collateralRatioBuffer = 25 * 10 ** 16;

  address creator;
  address owner;
  WrappedEtherInterface weth;
  IERC20 borrowedToken;
  MarketInterface fbMoneyMarket;

  event Log(uint x, string m);
  event Log(int x, string m);
  
  function initialize(
        address _owner, address tokenAddress, address wethAddress, address marketAddress
    ) public initializer {
        creator = msg.sender;
        owner = _owner;
        borrowedToken = IERC20(tokenAddress);
        fbMoneyMarket = MarketInterface(marketAddress);
        weth = WrappedEtherInterface(wethAddress);
        weth.approve(marketAddress, uint(-1));
        borrowedToken.approve(fbMoneyMarket, uint(-1));
   }

   function fund() payable external {
    require(creator == msg.sender);

    weth.deposit.value(msg.value)();

    uint supplyStatus = fbMoneyMarket.supply(weth, msg.value);
    require(supplyStatus == 0, "supply failed");

    /* --------- borrow the tokens ----------- */
    uint collateralRatio = fbMoneyMarket.collateralRatio();
    (uint status , uint totalSupply, uint totalBorrow) = fbMoneyMarket.calculateAccountValues(address(this));
    require(status == 0, "calculating account values failed");

    uint availableBorrow = findAvailableBorrow(totalSupply, totalBorrow, collateralRatio);

    uint assetPrice = fbMoneyMarket.assetPrices(borrowedToken);
    /*
      available borrow & asset price are both scaled 10e18, so include extra
      scale in numerator dividing asset to keep it there
    */
    uint tokenAmount = availableBorrow.mul(expScale).div(assetPrice);
    uint borrowStatus = fbMoneyMarket.borrow(borrowedToken, tokenAmount);
    require(borrowStatus == 0, "borrow failed");

    /* ---------- sweep tokens to user ------------- */
    uint borrowedTokenBalance = borrowedToken.balanceOf(address(this));
    borrowedToken.transfer(owner, borrowedTokenBalance);
  }

 
  /* @dev the factory contract will transfer tokens necessary to repay */
  function repay() external {
    require(creator == msg.sender);

    uint repayStatus = fbMoneyMarket.repayBorrow(borrowedToken, uint(-1));
    require(repayStatus == 0, "repay failed");

    /* ---------- withdraw excess collateral weth ------- */
    uint collateralRatio = fbMoneyMarket.collateralRatio();
    (uint status , uint totalSupply, uint totalBorrow) = fbMoneyMarket.calculateAccountValues(address(this));
    require(status == 0, "calculating account values failed");

    uint amountToWithdraw;
    if (totalBorrow == 0) {
      amountToWithdraw = uint(-1);
    } else {
      amountToWithdraw = findAvailableWithdrawal(totalSupply, totalBorrow, collateralRatio);
    }

    uint withdrawStatus = fbMoneyMarket.withdraw(weth, amountToWithdraw);
    require(withdrawStatus == 0 , "withdrawal failed");

    /* ---------- return ether to user ---------*/
    uint wethBalance = weth.balanceOf(address(this));
    weth.withdraw(wethBalance);
    owner.transfer(address(this).balance);
  }

  /* @dev it is necessary to accept eth to unwrap weth */
  function () public payable {}


}