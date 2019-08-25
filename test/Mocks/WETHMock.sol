pragma solidity ^0.5.0;
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/StandaloneERC20.sol";

contract WETHMock is WrappedEther {
  function setBalance(address _address, uint amount) public {
    balances[_address] = amount;
  }
}
