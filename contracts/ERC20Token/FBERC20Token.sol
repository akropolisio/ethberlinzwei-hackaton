pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/StandaloneERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Burnable.sol";


contract FBERC20Token is StandaloneERC20, ERC20Burnable {
    /* */

    function initialize(
        string memory name, string memory symbol, uint8 decimals, uint256 initialSupply, address initialHolder,
        address[] memory minters, address[] memory pausers
    ) public initializer  {
        StandaloneERC20.initialize(name, symbol, decimals, initialSupply, initialHolder, minters, pausers);
    }
    
    function version() public pure returns (string memory) {
      return "v1";
    }

    function mint(address to, uint256 value) public returns(bool) {
        super.mint(to, value);
        return true;
    }

    function burn(uint256 amount) public onlyMinter {
        super.burn(amount);
    }
}