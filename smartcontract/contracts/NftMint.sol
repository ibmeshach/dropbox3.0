// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;



import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


error Dropbox__TransferFailed();


contract NftMint is ERC721URIStorage, Ownable {
    // Miniting Nfts
    mapping(address => uint256) private userNftTokenCounter;
    mapping(address => mapping(uint256 => string)) private userUris;
    mapping(address => mapping(string => uint256)) private userUrisToCounter;


 struct myTransaction {
        address user;
        uint256 amount;
        uint timestamp;
    }

    myTransaction [] myTx;
     


    /**
    * @dev Using the constructor in the ERC721.sol
    */ 

    constructor() ERC721("Dropbox3.0", "DRB3"){}


    /**
     * @dev This is the function that takes in the tokenUri and Mints an NFT
     */

    function mintNft (string memory tokenUri, string memory imgUri) public payable {

        
        uint256 newTokenId = userNftTokenCounter[msg.sender];
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenUri);
        userUris[msg.sender][newTokenId] = imgUri;
        userUrisToCounter[msg.sender][imgUri] = newTokenId;
        userNftTokenCounter[msg.sender] += 1;
         myTx.push(myTransaction(msg.sender, msg.value, block.timestamp));
        
        
    }



    /**
     * @dev This is the function for the owner of the contract to withdraw funds from the smart contract
     */

    function withdraw() public payable onlyOwner {
        uint256 amount = address(this).balance;
        (bool success,) = payable(msg.sender).call{
            value: amount
        }("");
        if (!success){
            revert Dropbox__TransferFailed();
        }
    }

       function getTokenCounter(address user) public view returns (uint256){
        return userNftTokenCounter[user];
    }

      function getUserUrisToCounter(address user, string memory uri) public view returns (uint256){
        return userUrisToCounter[user][uri];
    }

      function get_My_Tx() public view returns (myTransaction[] memory){
        return myTx;
    }

    

  function getUserUris(address user, uint256 id) public view returns (string memory){
        return userUris[user][id];
    }

    




}
