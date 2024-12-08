// SPDX-License-Identifier: MIT
// Dong A University - Smart Contracts (last updated: v0.8.18)
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Marketplace {
    using Counters for Counters.Counter;
    Counters.Counter private idCounter;

    struct Item {
        address nftContract;
        uint256 tokenId;
        uint256 price;
        address seller;
        address buyer;
    }

    mapping(uint256 => Item) public item;

    event Sell(uint256 itemId);
    event Buy(uint256 itemId);

    function totalItem() public view returns (uint256) {
        return idCounter.current();
    }

    function sellNft(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public {
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        item[idCounter.current()] = Item (
            nftContract,
            tokenId,
            price,
            msg.sender,
            address(0)
        );
        emit Sell(idCounter.current());
        idCounter.increment();
    }
    
    function buyNft(uint256 itemId) external payable {
        Item memory _item = item[itemId];
        require(_item.price == msg.value, "Marketplace: only full payments accepted"); //chỉ chấp nhận thanh toán đầy đủ
        require(_item.seller != address(0), "Marketplace: not for sell"); //Không phải để bán
        
        IERC721(_item.nftContract).transferFrom(address(this), msg.sender, _item.tokenId);
        payable(_item.seller).transfer(msg.value);
        item[itemId].buyer = msg.sender;
        emit Buy(itemId);
    }
}