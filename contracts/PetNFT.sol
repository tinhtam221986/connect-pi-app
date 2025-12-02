// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PetNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct PetStats {
        uint256 strength;
        uint256 intelligence;
        uint256 speed;
        string element; // "Fire", "Water", "Wood", "Metal", "Earth"
    }

    mapping(uint256 => PetStats) public petStats;

    constructor() ERC721("PiGeneLabPet", "PGP") {}

    function mintPet(address recipient, string memory element, uint256 str, uint256 intl, uint256 spd)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);
        petStats[newItemId] = PetStats(str, intl, spd, element);

        return newItemId;
    }
}
