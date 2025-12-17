// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title YourToken
 * @dev ERC20 token with capped supply.
 * Faucet is the only minter.
 */
contract YourToken is ERC20 {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 1e18;

    address public minter;

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized minter");
        _;
    }

    constructor(address initialMinter) ERC20("YourToken", "YTK") {
        require(initialMinter != address(0), "Minter address cannot be zero");
        minter = initialMinter;
    }

    /**
     * @notice Update minter (used once during deployment)
     */
    function setMinter(address newMinter) external onlyMinter {
        require(newMinter != address(0), "New minter cannot be zero");
        minter = newMinter;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
