pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";

contract ERC20MintableInterface is IERC20 {
  function mint(address to, uint256 value) public returns (bool);
  function burn(uint256 amount) public;
}
