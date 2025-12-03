// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function mint(address to, uint256 tokenId) external;
}

/**
 * @title PetNFT
 * @dev Simple ERC721 implementation for GameFi Pets
 */
contract PetNFT {
    string public name = "Connect Pets";
    string public symbol = "PET";
    
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    uint256 public nextTokenId;
    address public gameMaster;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    modifier onlyGameMaster() {
        require(msg.sender == gameMaster, "Only Game Master");
        _;
    }

    constructor() {
        gameMaster = msg.sender;
    }

    function mint(address to) external onlyGameMaster returns (uint256) {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        _owners[tokenId] = to;
        _balances[to]++;
        
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner || _tokenApprovals[tokenId] == msg.sender || _operatorApprovals[owner][msg.sender], "ERC721: caller is not token owner or approved");
        require(owner == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        // Clear approvals from the previous owner
        _tokenApprovals[tokenId] = address(0);
        emit Approval(owner, address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(msg.sender == owner || _operatorApprovals[owner][msg.sender], "ERC721: approve caller is not token owner or approved for all");

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
}
