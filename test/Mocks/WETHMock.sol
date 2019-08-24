pragma solidity ^0.5.0;
import "../Tokens/WrappedEther.sol";

contract WETHMock is WrappedEther {
  function setBalance(address _address, uint amount) public {
    balances[_address] = amount;
  }
}
