pragma solidity ^0.5.0;

//import "./Market/MarketInterface.sol";
import "../cdp/FBCDP.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract TokenBorrowerFactory is Initializable {
  address wethAddress;
  MarketInterface fbMoneyMarket;
  IERC20 token;

 
  mapping(address => FBCDP) public borrowers;


  event createCDP(address cdpAddress);

  function initialize(
    address weth, address _token, address moneyMarket)
    public initializer {
    wethAddress = weth;
    token = IERC20(_token);
    fbMoneyMarket = MarketInterface(moneyMarket);
  }


  function deposit()  external payable {
    FBCDP cdp;
    if (address(borrowers[msg.sender]) == address(0x0)) {
      // create borrower contract if none exists
       cdp = new FBCDP();
       cdp.initialize(msg.sender, address(token), wethAddress, address(fbMoneyMarket));
       borrowers[msg.sender] = cdp;

       emit createCDP(address(cdp));

    } else {
      cdp = borrowers[msg.sender];
    }

    cdp.fund.value(msg.value)();
  }

  function borrow(uint256 amount) public {
    require(address(borrowers[msg.sender]) != address(0x0), "you need create CDP");
    FBCDP cdp;

    cdp = borrowers[msg.sender];

    cdp.borrow(amount);
  }

  function repay(uint256 amount) public {
    require(token.balanceOf(msg.sender)>=amount, "amount is failed");

    FBCDP cdp = borrowers[msg.sender];
    uint allowance = token.allowance(msg.sender, address(this));
    uint transferAmount = amount;
    token.transferFrom(msg.sender, address(cdp), transferAmount);
    cdp.repay();
  }

  function withdraw(uint256 amount) public {
    require(address(borrowers[msg.sender]) != address(0x0), "you need create CDP");
    FBCDP cdp;

    cdp = borrowers[msg.sender];
    cdp.withdraw(amount);
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
