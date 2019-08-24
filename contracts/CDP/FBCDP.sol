pragma solidity ^0.5.0;
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "../helpers/WrappedEtherInterface.sol";
import "../helpers/ERC20MintableInterface.sol";
import "../Market/MarketInterface.sol";

contract FBCDP is Initializable {
  using SafeMath for uint;
  uint constant expScale = 10**18;
  uint constant collateralRatioBuffer = 25 * 10 ** 16;

  address creator;
  address payable owner;
  WrappedEtherInterface weth;
  ERC20MintableInterface borrowedToken;
  MarketInterface fbMoneyMarket;

  event Log(uint x, string m);
  event Log(int x, string m);
  
  function initialize(
        address payable _owner, address tokenAddress, address wethAddress, address marketAddress
    ) public initializer {
        creator = msg.sender;
        owner = _owner;
        borrowedToken = ERC20MintableInterface(tokenAddress);
        fbMoneyMarket = MarketInterface(marketAddress);
        weth = WrappedEtherInterface(wethAddress);
        weth.approve(marketAddress, uint(-1));
        borrowedToken.approve(address(fbMoneyMarket), uint(-1));
   }

   function fund() payable external {
    require(creator == msg.sender);

    weth.deposit.value(msg.value)();

    bool supplyStatus = fbMoneyMarket.supply(address(weth), msg.value);
    require(supplyStatus == false, "supply failed");

    /* --------- borrow the tokens ----------- */
    uint collateralRatio = fbMoneyMarket.collateralRatio();
    (bool status , uint totalSupply, uint totalBorrow) = fbMoneyMarket.calculateAccountValues(address(this));
    require(status ==  false, "calculating account values failed");

    uint availableBorrow = findAvailableBorrow(totalSupply, totalBorrow, collateralRatio);

    uint assetPrice = fbMoneyMarket.assetPrices(address(borrowedToken));
    /*
      available borrow & asset price are both scaled 10e18, so include extra
      scale in numerator dividing asset to keep it there
    */
    uint tokenAmount = availableBorrow.mul(expScale).div(assetPrice);

    //minting tokens
    bool borrowStatus = fbMoneyMarket.borrow(address(borrowedToken), tokenAmount);

    require(borrowStatus == false, "borrow failed");

    /* ---------- sweep tokens to user ------------- */
    uint borrowedTokenBalance = borrowedToken.balanceOf(address(this));
    borrowedToken.transfer(owner, borrowedTokenBalance);
  }

  /* @dev the factory contract will transfer tokens necessary to repay */
  function repay() external {
    require(creator == msg.sender);

    bool repayStatus = fbMoneyMarket.repayBorrow(address(borrowedToken), uint(-1));
    require(repayStatus == false, "repay failed");

    /* ---------- withdraw excess collateral weth ------- */
    uint collateralRatio = fbMoneyMarket.collateralRatio();
    (bool status , uint totalSupply, uint totalBorrow) = fbMoneyMarket.calculateAccountValues(address(this));
    require(status == false, "calculating account values failed");

    uint amountToWithdraw;
    if (totalBorrow == 0) {
      amountToWithdraw = uint(-1);
    } else {
      amountToWithdraw = findAvailableWithdrawal(totalSupply, totalBorrow, collateralRatio);
    }

    bool withdrawStatus = fbMoneyMarket.withdraw(address(weth), amountToWithdraw);
    require(withdrawStatus == false, "withdrawal failed");

    /* ---------- return ether to user ---------*/
    uint wethBalance = weth.balanceOf(address(this));
    weth.withdraw(wethBalance);
    owner.transfer(address(this).balance);
  }


  /* @dev returns borrow value in eth scaled to 10e18 */
  function findAvailableBorrow(uint currentSupplyValue, uint currentBorrowValue, uint collateralRatio) public pure returns (uint) {
    uint totalPossibleBorrow = currentSupplyValue.mul(expScale).div(collateralRatio.add(collateralRatioBuffer));
    if ( totalPossibleBorrow > currentBorrowValue ) {
      return totalPossibleBorrow.sub(currentBorrowValue).div(expScale);
    } else {
      return 0;
    }
  }

  /* @dev returns available withdrawal in eth scale to 10e18 */
  function findAvailableWithdrawal(uint currentSupplyValue, uint currentBorrowValue, uint collateralRatio) public pure returns (uint) {
    uint requiredCollateralValue = currentBorrowValue.mul(collateralRatio.add(collateralRatioBuffer)).div(expScale);
    if ( currentSupplyValue > requiredCollateralValue ) {
      return currentSupplyValue.sub(requiredCollateralValue).div(expScale);
    } else {
      return 0;
    }
  }

  /* @dev it is necessary to accept eth to unwrap weth */
  function () external payable {}


}