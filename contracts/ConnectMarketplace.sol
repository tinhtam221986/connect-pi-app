// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ConnectMarketplace {
    struct Listing {
        uint256 id;
        address seller;
        string itemId; // String ID to link to off-chain metadata or other NFT contract
        uint256 price;
        bool active;
        uint256 timestamp;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;
    IERC20 public paymentToken;

    address public owner;
    uint256 public platformFeePercent = 2; // 2% fee

    event ItemListed(uint256 indexed id, address indexed seller, string itemId, uint256 price);
    event ItemSold(uint256 indexed id, address indexed buyer, uint256 price);
    event ItemCancelled(uint256 indexed id);
    event FeeUpdated(uint256 newFee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _paymentToken) {
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
    }

    function setFee(uint256 _fee) external onlyOwner {
        require(_fee <= 20, "Fee too high"); // Max 20%
        platformFeePercent = _fee;
        emit FeeUpdated(_fee);
    }

    function listItem(string calldata _itemId, uint256 _price) external {
        require(_price > 0, "Price must be > 0");

        listings[nextListingId] = Listing({
            id: nextListingId,
            seller: msg.sender,
            itemId: _itemId,
            price: _price,
            active: true,
            timestamp: block.timestamp
        });

        emit ItemListed(nextListingId, msg.sender, _itemId, _price);
        nextListingId++;
    }

    function buyItem(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Item not active");
        require(msg.sender != listing.seller, "Seller cannot buy own item");

        uint256 feeAmount = (listing.price * platformFeePercent) / 100;
        uint256 sellerAmount = listing.price - feeAmount;

        // Transfer fee to platform owner
        if (feeAmount > 0) {
            require(paymentToken.transferFrom(msg.sender, owner, feeAmount), "Fee transfer failed");
        }

        // Transfer remaining to seller
        require(paymentToken.transferFrom(msg.sender, listing.seller, sellerAmount), "Payment failed");

        listing.active = false;

        emit ItemSold(_listingId, msg.sender, listing.price);
    }

    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(msg.sender == listing.seller || msg.sender == owner, "Not authorized");
        require(listing.active, "Item not active");

        listing.active = false;
        emit ItemCancelled(_listingId);
    }
}
