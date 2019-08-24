pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/StandaloneERC20.sol";

contract FBERC20Token is StandaloneERC20 {
    /* */

    function version() public pure returns (string memory) {
    return "v1";
  }
}