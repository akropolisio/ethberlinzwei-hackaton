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
    
    require(supplyStatus == true, "supply failed");
  }

  function borrow(uint256 tokenAmount) public {
    //minting tokens
    bool borrowStatus = fbMoneyMarket.borrow(address(this), address(borrowedToken), address(weth), tokenAmount);
    
    require(borrowStatus == true, "borrow failed");

    uint borrowedTokenBalance = borrowedToken.balanceOf(address(this));
    borrowedToken.transfer(owner, borrowedTokenBalance);
  }

  /* @dev the factory contract will transfer tokens necessary to repay */
  function repay() external {
    require(creator == msg.sender);

    bool repayStatus = fbMoneyMarket.repayBorrow(address(borrowedToken), uint(-1));
    require(repayStatus == true, "repay failed");
  }

  function withdraw(uint256 amount) external {
    uint amountToWithdraw;

    uint totalBorrow = fbMoneyMarket.getBorrowBalance(address(this), address(borrowedToken));
    uint totalEth = fbMoneyMarket.getSupplyBalance(address(this), address(weth));

    if (totalBorrow == 0) {
      amountToWithdraw = uint(-1);
    } else {
      require(amount<=(totalEth*fbMoneyMarket.ethPrice()), "eth is locked");
      amountToWithdraw = amount;
    }

    bool withdrawStatus = fbMoneyMarket.withdraw(address(weth), amountToWithdraw);

    require(withdrawStatus == true, "withdrawal failed");

    /* ---------- return ether to user ---------*/
    uint wethBalance = weth.balanceOf(address(this));
    weth.withdraw(wethBalance);
    owner.transfer(address(this).balance);
  }

  /* @dev it is necessary to accept eth to unwrap weth */
  function () external payable {}


}