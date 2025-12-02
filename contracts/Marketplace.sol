// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price; // Price in Pi (wei equivalent)
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;
    uint256 public platformFeePercent = 5; // 5% fee

    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 price);
    event ListingSold(uint256 indexed listingId, address indexed buyer, uint256 price);

    function createListing(address nftContract, uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be > 0");
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        listings[nextListingId] = Listing(nextListingId, msg.sender, nftContract, tokenId, price, true);
        emit ListingCreated(nextListingId, msg.sender, price);
        nextListingId++;
    }

    function buyListing(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.active = false;

        uint256 fee = (listing.price * platformFeePercent) / 100;
        uint256 payout = listing.price - fee;

        payable(listing.seller).transfer(payout);
        payable(owner()).transfer(fee);

        IERC721(listing.nftContract).transferFrom(address(this), msg.sender, listing.tokenId);

        emit ListingSold(listingId, msg.sender, listing.price);
    }
}
