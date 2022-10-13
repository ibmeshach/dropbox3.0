// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;


error Dropbox__AlreadyRegistered();
error Dropbox__AlreadyUploaded();
error Dropbox__AlreadyAdded();
error Dropbox__NotUploaded();
error Dropbox__RegisterUserPlease();
error Dropbox__AlreadyYourFriend();
error Dropbox__AlreadyPinned();
error Dropbox__NotOwnerOfFile();



/**@title Dropbox3.0
 * @author CodePeeps
 * @notice This contract is for storing, sharing files with friends and also minting of NFTs
 * @dev This implements the openzepplin NFT contract
 */


contract Dropbox  {


    modifier isRegistered(address user){
        if(successfulRegister[user] == false){
            revert Dropbox__RegisterUserPlease();
        }
        _;
    }


    modifier isUploaded(string memory file){
        if(successfulUpload[file] == false){
            revert Dropbox__NotUploaded();
        }
        _;
    }


    modifier isMyFriend(address adder, address friend){
        if(MyFriend[adder][friend] == true || MyFriend[friend][adder] == true){
            revert Dropbox__AlreadyYourFriend();
        }
        _;
    }

    modifier isOwnerOfFile(string memory file, address pinner){
        if(fileOwner[file] != pinner){
            revert Dropbox__NotOwnerOfFile();
        }
        _;
    }




    // users
    address [] private users;
    mapping(address => bool) private successfulRegister;
    mapping(address => bytes) private UserToUserName;


    //  files
    string [] private fileHashes;
    mapping(address => uint256) private numberOfItems;
    mapping(address => mapping(uint256 => string)) private userToFiles;
    mapping(address => mapping(string => uint256)) private fileToSize;
    mapping(address => mapping(string => uint256)) private fileToDate;
    mapping(string => bool) private successfulUpload;
    mapping(address => mapping(string => uint256)) private filesToNumber;
    mapping(string => bytes) private fileToDescription;
    mapping(string => bytes) private nameOfFile;
    mapping(string => address) private fileOwner;
    mapping(address => uint256) private userTotalSize;


    // sent items
    mapping(address => uint256) private numberOfSentItems;
    mapping(address => mapping(uint256 => string)) private userToSentItems;
    mapping(address => mapping(string => uint256)) private sendFileToDate;


    // received items
    mapping(address => uint256) private numberOfReceivedItems;
    mapping(address => mapping(uint256 => string)) private userToReceivedItems;
    mapping(address => mapping(string => uint256)) private receiveFileToDate;


    // add friends
    mapping(address => mapping(uint256 => address)) private friendToFriend;
    mapping(address => uint256) private friendToNumber;
    mapping(address => mapping(address => uint256)) private friendNumber;
    mapping(address => mapping(address => bool)) private MyFriend;




    // filebase
    uint256 private filebaseTrack;
    string [] private pinnedFilebaseFiles;
    mapping(string => bool) private filebasePin;
    mapping(string => uint256) private filebaseArrayPosition;
    mapping(string => uint256) private filebasePinToDate;
    mapping(address => uint256) private numberOfFilebaseFiles;
    mapping(address => mapping(uint256 => string)) private filebasePinUserToFile;
    mapping(address => mapping(string => uint256)) private filebaseFilesToNumber;



    // infura
    uint256 private infuraTrack;
    string [] private pinnedInfuraFiles;
    mapping(string => bool) private infuraPin;
    mapping(string => uint256) private infuraArrayPosition;
    mapping(string => uint256) private infuraPinToDate;
    mapping(address => uint256) private numberOfInfuraFiles;
    mapping(address => mapping(uint256 => string)) private infuraPinUserToFile;
    mapping(address => mapping(string => uint256)) private infuraFilesToNumber;


    // pinata
    uint256 private pinataTrack;
    string [] private pinnedPinataFiles;
    mapping(string => bool) private pinataPin;
    mapping(string => uint256) private pinataArrayPosition;
    mapping(string => uint256) private pinataPinToDate;
    mapping(address => uint256) private numberOfPinataFiles;
    mapping(address => mapping(uint256 => string)) private pinataPinUserToFile;
    mapping(address => mapping(string => uint256)) private pinataFilesToNumber;

    



    /**
     * @dev This is the function to register new users
     */





    function register(string memory username) public {
        if(successfulRegister[msg.sender] == false){
            users.push(msg.sender);
            successfulRegister[msg.sender] = true;
            UserToUserName[msg.sender] = encodeStringPacked(username);
        }else{
            revert Dropbox__AlreadyRegistered();
        }
        
    }
    

    /**
     * @dev This is the function to change username of users
     */

    function changeUserName(string memory username) public isRegistered(msg.sender) {
        UserToUserName[msg.sender] = encodeStringPacked(username);
    }




    /**
     * @dev This is the function to upload files
     */

    function upload(string memory file, uint256 size, uint256 date, string memory description, string memory fileName) public isRegistered(msg.sender) {
        if(successfulUpload[file] == false){
            fileHashes.push(file);
            nameOfFile[file] = encodeStringPacked(fileName);
            userToFiles[msg.sender][numberOfItems[msg.sender]] = file;
            fileToSize[msg.sender][userToFiles[msg.sender][numberOfItems[msg.sender]]] = size;
            fileToDate[msg.sender][userToFiles[msg.sender][numberOfItems[msg.sender]]] = date;
            filesToNumber[msg.sender][file] = numberOfItems[msg.sender];
            numberOfItems[msg.sender] += 1;
            successfulUpload[file] = true;
            fileToDescription[file] = encodeStringPacked(description);
            fileOwner[file] = msg.sender;
            userTotalSize[msg.sender] += size;
            
        }else{
            revert Dropbox__AlreadyUploaded();
        }
        
   

    }


    /**
     * @dev This is the function to add friends
     */


    function addFriend(address friend) public isRegistered(friend) isRegistered(msg.sender) isMyFriend(msg.sender, friend) {
        friendToFriend[msg.sender][friendToNumber[msg.sender]] = friend;
        friendToFriend[friend][friendToNumber[friend]] = msg.sender;
        friendNumber[msg.sender][friend] = friendToNumber[msg.sender];
        friendNumber[friend][msg.sender] = friendToNumber[friend];
        friendToNumber[msg.sender] += 1;
        friendToNumber[friend] += 1;
        MyFriend[msg.sender][friend] = true;
        MyFriend[friend][msg.sender] = true;

        
    }


    /**
     * @dev This is the function to send files
     */


    function sendItem(address friend, string memory files, uint256 date) public isUploaded(files) isRegistered(msg.sender) isRegistered(friend) {
       
    
      
        userToSentItems[msg.sender][numberOfSentItems[msg.sender]] = files;
        sendFileToDate[msg.sender][userToSentItems[msg.sender][numberOfSentItems[msg.sender]]] = date;
        numberOfSentItems[msg.sender] += 1;
        userToReceivedItems[friend][numberOfReceivedItems[friend]] = files;
        receiveFileToDate[friend][userToReceivedItems[friend][numberOfReceivedItems[friend]]] = date;
        numberOfReceivedItems[friend] += 1;
    }


    /**
     * @dev This is the function to delete files
     */



    /**
     * @dev This is the function to encode strings
     */

    function encodeStringPacked(string memory words) private pure returns(bytes memory){
        bytes memory someString = abi.encodePacked(words);
        return someString;
    }

    /**
     * @dev This is the function to decode strings
     */


    function decodeStringPacked(bytes memory encode) private pure returns(string memory){
        string memory someString = string(encode);
        return someString;
    }




    /**
     * @dev This is the function to store filebase pinned files
     */

  

    function pinFileToFilebase(string memory file, uint256 date) public isOwnerOfFile(file, msg.sender) isRegistered(msg.sender) isUploaded(file){
        if(filebasePin[file] == false){
            pinnedFilebaseFiles.push(file);
            filebaseArrayPosition[file] = filebaseTrack;
            filebasePinUserToFile[msg.sender][numberOfFilebaseFiles[msg.sender]] = file;
            filebaseFilesToNumber[msg.sender][file] = numberOfFilebaseFiles[msg.sender];
            numberOfFilebaseFiles[msg.sender] += 1;
            filebaseTrack += 1;
            filebasePinToDate[file] = date;
            filebasePin[file] = true;
            

        }else{
            revert Dropbox__AlreadyPinned();
        }
        

    }




    /**
     * @dev This is the function to store infura pinned files
     */

    function pinFileToInfura(string memory file, uint256 date) public isOwnerOfFile(file, msg.sender) isRegistered(msg.sender) isUploaded(file){
            if(infuraPin[file] == false){
                pinnedInfuraFiles.push(file);
                infuraArrayPosition[file] = infuraTrack;
                infuraPinUserToFile[msg.sender][numberOfInfuraFiles[msg.sender]] = file;
                infuraFilesToNumber[msg.sender][file] = numberOfInfuraFiles[msg.sender];
                numberOfInfuraFiles[msg.sender] += 1;
                infuraTrack += 1;
                infuraPinToDate[file] = date;
                infuraPin[file] = true;
                

            }else{
                revert Dropbox__AlreadyPinned();
            }
            

        }


        
    /**
     * @dev This is the function to remove infura pinned files
     */


 




    /**
     * @dev This is the function to remove pinata pinned files
     */


    function pinFileToPinata(string memory file, uint256 date) public isOwnerOfFile(file, msg.sender) isRegistered(msg.sender) isUploaded(file){
        if(pinataPin[file] == false){
            pinnedPinataFiles.push(file);
            pinataArrayPosition[file] = pinataTrack;
            pinataPinUserToFile[msg.sender][numberOfPinataFiles[msg.sender]] = file;
            pinataFilesToNumber[msg.sender][file] = numberOfPinataFiles[msg.sender];
            numberOfPinataFiles[msg.sender] += 1;
            pinataTrack += 1;
            pinataPinToDate[file] = date;
            pinataPin[file] = true;
            

        }else{
            revert Dropbox__AlreadyPinned();
        }
        

    }
    



      /** Getter Functions */

    function getSuccessfulRegister(address user) public view returns (bool){
        return successfulRegister[user];
    }

    
    function getNumberOfFiles(address user) public view returns (uint256){
        return numberOfItems[user];
    }
    
    function getFiles(address user, uint256 id) public view returns (string memory){
        return userToFiles[user][id];
    }

    
    
    function getSizeOfFile(address user, string memory file) public view returns (uint256){
        return fileToSize[user][file];
    }

     function getDateOfFile(address user, string memory file) public view returns (uint256){
        return fileToDate[user][file];
    }

     function getFileId(address user, string memory file) public view returns (uint256){
        return filesToNumber[user][file];
    }


     function getFileDescription(string memory file) public view returns (string memory){
        string memory result = decodeStringPacked(fileToDescription[file]) ; 
        return result;
    }

      function getNameOfFile(string memory file) public view returns (string memory){
        string memory result = decodeStringPacked(nameOfFile[file]) ; 
        return result;
    }


    // filebase






  
    function getNumberOfFilebaseFiles(address user) public view returns (uint256){
        return numberOfFilebaseFiles[user];
    }

      
    function getFilebaseUserFiles(address user, uint256 id) public view returns (string memory){
        return filebasePinUserToFile[user][id];
    }
    
    
    function getFilebasePinDate(string memory file) public view returns (uint256){
        return filebasePinToDate[file];
    }



    // infura


    
    function getNumberOfInfuraFiles(address user) public view returns (uint256){
        return numberOfInfuraFiles[user];
    }

      
    function getInfuraUserFiles(address user, uint256 id) public view returns (string memory){
        return infuraPinUserToFile[user][id];
    }
    
    
    function getInfuraPinDate(string memory file) public view returns (uint256){
        return infuraPinToDate[file];
    }



    // pinata



    
    function getNumberOfPinataFiles(address user) public view returns (uint256){
        return numberOfPinataFiles[user];
    }

      
    function getPinataUserFiles(address user, uint256 id) public view returns (string memory){
        return pinataPinUserToFile[user][id];
    }
    
    
    function getPinataPinDate(string memory file) public view returns (uint256){
        return pinataPinToDate[file];
    }



    
// friends

 function getFriends(address user, uint256 id) public view returns (address){
        return friendToFriend[user][id];
    }
    

    
 function getFriendsNumber(address user) public view returns (uint256){
        return friendToNumber[user];
    }
    


// sentItems

 function getSentItems(address user, uint256 id) public view returns (string memory){
        return userToSentItems[user][id];
    }
    

    
 function getSentNumber(address user) public view returns (uint256){
        return numberOfSentItems[user];
    }


    function getSentItemDate(address user, string memory file) public view returns (uint256){
        return sendFileToDate[user][file];
    }
    


    // receivedItems


     function getReceivedItems(address user, uint256 id) public view returns (string memory){
        return userToReceivedItems[user][id];
    }
    

    
 function getReceivedNumber(address user) public view returns (uint256){
        return numberOfReceivedItems[user];
    }


    function getReceivedItemDate(address user, string memory file) public view returns (uint256){
        return receiveFileToDate[user][file];
    }




 function getUsername(address user) public view returns (string memory){
        string memory result = decodeStringPacked(UserToUserName[user]) ; 
        return result;
    }

     function getUserTotalSize(address user) public view returns (uint256){
        return userTotalSize[user];
    }
    
}




// mapping(address => bytes) private UserToUserName;
//   mapping(address => uint256) private userTotalSize;
