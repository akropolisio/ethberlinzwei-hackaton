pragma solidity ^0.5.0;

//import "./Market/MarketInterface.sol";
import "../CDP/FBCDP.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract TokenBorrowerFactory is Initializable {
  address wethAddress;
  MarketInterface fbMoneyMarket;
  IERC20 token;

  mapping(address => FBCDP) public borrowers;

  function initialize(
    address weth, address _token, address moneyMarket)
    public initializer {
    wethAddress = weth;
    token = IERC20(_token);
    fbMoneyMarket = MarketInterface(moneyMarket);
  }


  function()  external payable {
    FBCDP cdp;
    if (address(borrowers[msg.sender]) == address(0x0)) {
      // create borrower contract if none exists
       cdp = new FBCDP();
       cdp.initialize(msg.sender, address(token), wethAddress, address(fbMoneyMarket));
       borrowers[msg.sender] = cdp;
    } else {
      cdp = borrowers[msg.sender];
    }

    cdp.fund.value(msg.value)();
  }

  function repay() public {
    FBCDP cdp = borrowers[msg.sender];
    uint allowance = token.allowance(msg.sender, address(this));
    uint borrowBalance = fbMoneyMarket.getBorrowBalance(address(cdp), address(token));
    uint userTokenBalance = token.balanceOf(msg.sender);
    uint transferAmount = min(min(allowance, borrowBalance), userTokenBalance);

    token.transferFrom(msg.sender, address(cdp), transferAmount);
    cdp.repay();
  }

  function min(uint a, uint b) private pure returns ( uint ) {
    if (a <= b) {
      return a;
    } else {
      return b;
    }
  }

  function getBorrowBalance(address user) view public returns (uint) {
    return fbMoneyMarket.getBorrowBalance(address(borrowers[user]), address(token));
  }

  function getSupplyBalance(address user) view public returns (uint) {
    return fbMoneyMarket.getSupplyBalance(address(borrowers[user]), wethAddress);
  }
}
