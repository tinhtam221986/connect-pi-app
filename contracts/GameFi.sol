// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title GameFi
 * @dev Manages player stats, levels, and rewards.
 */
contract GameFi {
    struct Player {
        uint256 level;
        uint256 exp;
        uint256 battlesWon;
        uint256 lastActive;
    }

    mapping(address => Player) public players;
    address public owner;
    IERC20 public rewardToken; // Address of the ConnectToken

    event LevelUp(address indexed player, uint256 newLevel);
    event BattleWon(address indexed player, uint256 expGained);
    event RewardClaimed(address indexed player, uint256 amount);

    constructor(address _rewardToken) {
        owner = msg.sender;
        rewardToken = IERC20(_rewardToken);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function register() external {
        require(players[msg.sender].level == 0, "Already registered");
        players[msg.sender] = Player(1, 0, 0, block.timestamp);
    }

    function recordWin(address _player, uint256 _exp) external onlyOwner {
        Player storage p = players[_player];
        if (p.level == 0) return;

        p.exp += _exp;
        p.battlesWon++;
        p.lastActive = block.timestamp;

        emit BattleWon(_player, _exp);

        // Level up logic: Level * 100 XP required
        if (p.exp >= p.level * 100) {
            p.level++;
            p.exp = 0;
            emit LevelUp(_player, p.level);

            // Give reward on level up (10 tokens * new level)
            uint256 rewardAmount = p.level * 10 * 10**18; // Assuming 18 decimals
            
            // Check if contract has enough balance
            if (rewardToken.balanceOf(address(this)) >= rewardAmount) {
                bool success = rewardToken.transfer(_player, rewardAmount);
                if (success) {
                    emit RewardClaimed(_player, rewardAmount);
                }
            }
        }
    }

    function getPlayer(address _player) external view returns (uint256, uint256, uint256, uint256) {
        Player memory p = players[_player];
        return (p.level, p.exp, p.battlesWon, p.lastActive);
    }
}
