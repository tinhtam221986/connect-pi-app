// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GameFi is Ownable {
    IERC20 public token;
    mapping(address => uint256) public playerScores;

    event ScoreSubmitted(address player, uint256 score, uint256 reward);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function submitScore(uint256 _score) public {
        playerScores[msg.sender] += _score;
        // Simple reward logic: 1 token per 100 points
        // In production, this needs anti-cheat and server signatures
        uint256 reward = _score / 100;

        emit ScoreSubmitted(msg.sender, _score, reward);
    }
}
