// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConnectMarketplace is Ownable {
    struct Item {
        uint256 id;
        string name;
        uint256 price;
        address seller;
        bool active;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;
    IERC20 public token;

    event ItemListed(uint256 id, string name, uint256 price, address seller);
    event ItemPurchased(uint256 id, address buyer, address seller);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function listItem(string memory _name, uint256 _price) public {
        itemCount++;
        items[itemCount] = Item(itemCount, _name, _price, msg.sender, true);
        emit ItemListed(itemCount, _name, _price, msg.sender);
    }

    function buyItem(uint256 _id) public {
        Item storage item = items[_id];
        require(item.active, "Item not active");
        require(token.transferFrom(msg.sender, item.seller, item.price), "Transfer failed");

        item.active = false;
        emit ItemPurchased(_id, msg.sender, item.seller);
    }
}
