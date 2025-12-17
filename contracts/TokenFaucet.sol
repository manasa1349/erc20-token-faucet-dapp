// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Mintable {
    function mint(address to, uint256 amount) external;
}

/**
 * @title TokenFaucet
 * @dev ERC20 faucet with cooldown, lifetime limit, and pause control
 */
contract TokenFaucet {
    IERC20Mintable public token;

    uint256 public constant FAUCET_AMOUNT = 100 * 1e18;
    uint256 public constant COOLDOWN_TIME = 1 days;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 * 1e18;

    address public admin;
    bool private paused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        token = IERC20Mintable(tokenAddress);
        admin = msg.sender;
        paused = false;
    }

    function requestTokens() external {
        require(!paused, "Faucet is paused");

        // Explicit lifetime limit check (clear revert reason)
        require(
            remainingAllowance(msg.sender) >= FAUCET_AMOUNT,
            "Lifetime claim limit reached"
        );

        // Cooldown check
        require(
            block.timestamp >= lastClaimAt[msg.sender] + COOLDOWN_TIME,
            "Cooldown period not elapsed"
        );

        // Effects
        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        // Interaction
        token.mint(msg.sender, FAUCET_AMOUNT);

        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        if (remainingAllowance(user) < FAUCET_AMOUNT) return false;
        return true;
    }

    function remainingAllowance(address user) public view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) {
            return 0;
        }
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin");
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function isPaused() external view returns (bool) {
        return paused;
    }
}