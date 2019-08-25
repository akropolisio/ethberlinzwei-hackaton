pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Detailed.sol";
import "./ERC20Mock.sol";


contract Weth is Initializable, ERC20Mock, ERC20Detailed {
    
    function initialize(string memory name, string memory symbol, uint8 decimals) public initializer {
       ERC20Detailed.initialize(name, symbol, decimals);
    } 

   /**
    * @dev Send ether to get tokens
  */
  function deposit() public payable {
    _balances[msg.sender] += msg.value;
    _totalSupply += msg.value;
    emit Transfer(address(this), msg.sender, msg.value);
  }

  /**
    * @dev Withdraw tokens as ether
    */
  function withdraw(uint amount) public {
      require(_balances[msg.sender] >= amount);
      _balances[msg.sender] -= amount;
      _totalSupply -= amount;
      require(msg.sender.send(amount));
      emit Transfer(msg.sender, address(this), amount);
  }
}
