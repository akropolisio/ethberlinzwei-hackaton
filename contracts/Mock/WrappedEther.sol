pragma solidity ^0.5.0;

import "./StandardToken.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

/**
  * @title The Compound Wrapped Ether Test Token
  * @author Compound
  * @notice A simple test token to wrap ether
  */
contract WrappedEther is Initializable, StandardToken {
  string public name;
  string public symbol;
  uint8 public decimals;

  function initialize(string memory _name, string memory _symbol, uint8 _decimals) public initializer  {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
  }

  /**
    * @dev Send ether to get tokens
    */
  function deposit() public payable {
    balances[msg.sender] += msg.value;
    totalSupply_ += msg.value;
    emit Transfer(address(this), msg.sender, msg.value);
  }

  /**
    * @dev Withdraw tokens as ether
    */
  function withdraw(uint amount) public {
      require(balances[msg.sender] >= amount);
      balances[msg.sender] -= amount;
      totalSupply_ -= amount;
      require(msg.sender.send(amount));
      emit Transfer(msg.sender, address(this), amount);
  }
}
