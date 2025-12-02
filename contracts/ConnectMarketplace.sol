// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ConnectMarketplace is ReentrancyGuard {
    struct Item {
        uint256 id;
        address seller;
        uint256 price;
        string metadataURI;
        bool isSold;
    }

    uint256 public itemCount;
    mapping(uint256 => Item) public items;
    IERC20 public token;

    event ItemListed(uint256 indexed id, address indexed seller, uint256 price);
    event ItemSold(uint256 indexed id, address indexed buyer, uint256 price);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function listItem(uint256 _price, string memory _metadataURI) external {
        require(_price > 0, "Price must be greater than 0");
        itemCount++;
        items[itemCount] = Item(itemCount, msg.sender, _price, _metadataURI, false);
        emit ItemListed(itemCount, msg.sender, _price);
    }

    function buyItem(uint256 _id) external nonReentrant {
        Item storage item = items[_id];
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        require(!item.isSold, "Item already sold");
        require(token.balanceOf(msg.sender) >= item.price, "Insufficient balance");

        item.isSold = true;
        require(token.transferFrom(msg.sender, item.seller, item.price), "Transfer failed");

        emit ItemSold(_id, msg.sender, item.price);
    }
}
