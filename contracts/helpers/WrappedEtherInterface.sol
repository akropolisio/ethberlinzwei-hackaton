pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";

contract WrappedEtherInterface is IERC20 {

  function deposit() public payable;

  function withdraw(uint amount) public;
}