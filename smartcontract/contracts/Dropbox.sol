// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

  error Dropbox__AlreadyRegistered();
  error Dropbox__AlreadyUploaded();
  error Dropbox__AlreadyAdded();
  error Dropbox__NotUploaded();
  error Dropbox__RegisterPlease();

contract Dropbox {


modifier isRegistered(address user){
     if(successfulRegister[user] == false){
         revert Dropbox__RegisterPlease();
     }
     _;
}


modifier isUploaded(string memory file){
     if(successfulUpload[file] == false){
         revert Dropbox__NotUploaded();
     }
     _;
}





address [] public users;
string [] public fileHashes;
mapping(address => uint256) public numberOfItems;

mapping(address => uint256) public numberOfSentItems;
mapping(address => uint256) public numberOfReceivedItems;

mapping(address => mapping(uint256 => string)) public userToFiles;

mapping(address => mapping(uint256 => string)) public userToSentItems;
mapping(address => mapping(uint256 => string)) public userToReceivedItems;

mapping(address => bool) public successfulRegister;
mapping(string => bool) public successfulUpload;

mapping(address => mapping(string => uint256)) public filesToNumber;



    function register() public {
        if(successfulRegister[msg.sender] == false){
            users.push(msg.sender);
            successfulRegister[msg.sender] = true;
        }else{
            revert Dropbox__AlreadyRegistered();
        }
        
    }


    function upload(string memory file) public isRegistered(msg.sender) {
        if(successfulUpload[file] == false){
            fileHashes.push(file);
            userToFiles[msg.sender][numberOfItems[msg.sender]] = file;
            filesToNumber[msg.sender][file] = numberOfItems[msg.sender];
            numberOfItems[msg.sender] += 1;
            successfulUpload[file] = true;
        }else{
            revert Dropbox__AlreadyUploaded();
        }
        
   

    }

    function sendItem(address friend, string memory files) public isUploaded(files) isRegistered(msg.sender) isRegistered(friend) {
        userToFiles[friend][numberOfItems[friend]] = files;
        filesToNumber[msg.sender][files] = numberOfItems[msg.sender];
        numberOfItems[friend] += 1;
        userToSentItems[msg.sender][numberOfSentItems[msg.sender]] = files;
        numberOfSentItems[msg.sender] += 1;
        userToReceivedItems[friend][numberOfReceivedItems[friend]] = files;
        numberOfReceivedItems[friend] += 1;
    }

    function deleteItem(string memory file) public isUploaded(file) isRegistered(msg.sender){
        uint256 count = filesToNumber[msg.sender][file];
        delete userToFiles[msg.sender][count];
        successfulUpload[file] = false;

        for(uint256 i=count; i<numberOfItems[msg.sender]; i++){
            userToFiles[msg.sender][i] = userToFiles[msg.sender][i + 1]; 
        }
     
        
    }

  

    
}