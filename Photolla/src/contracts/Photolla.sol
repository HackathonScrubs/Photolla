pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Photolla {
  string public name = "Photolla";
  uint public creatorCount = 0;
  //uint public imageCount = 0;
	mapping(uint => Creator) public creators;
  mapping(address => uint) public creatorIDs;
	mapping(address => Image[]) public images;
  /*A mapping is essentially a key-value store for storing and looking up data.
  key is an uint, value is an Image*/

  struct Creator {
	  uint creatorId;
    uint imageCount;
	  address creatorAddress;
	  string creatorName;
    string defaultProfile;
    string profileHash;
    string bio;
  }

  event CreatorNameCreated(
    uint creatorId,
    uint imageCount,
    address creatorAddress,
    string creatorName,
    string defaultProfile,
    string profileHash,
    string bio
	);

  struct Image {
	  uint imageId;
	  string hash;
	  string description;
	  uint tipAmount;
	  address payable author; //mechanism to collect or receive fund to the contract
  }

  event ImageCreated(
    uint imageId,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint imageId,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );
/*
Event is an inheritable member of a contract.
An event is emitted, it stores the arguments passed in transaction logs.
These logs are stored on blockchain and are accessible using address of the contract
https://www.tutorialspoint.com/solidity/solidity_events.htm
Events are a way for your contract to communicate that something happened on the blockchain to your app front-end,
which can be 'listening' for certain events and take action when they happen*/

  function getImages(address creatorAddress) public returns (Image[] memory creatorImages) {
    return images[creatorAddress];
  }

//add creator name
	function newCreator(string memory _creatorName, string memory _profileHash, string memory _defaultProfile, string memory _bio) public {
		require(msg.sender != address(0x0));
		require(bytes(_creatorName).length > 0);
		creatorCount++;
    creatorIDs[msg.sender] = creatorCount;
		creators[creatorCount] = Creator(creatorCount, 0, msg.sender, _creatorName, _defaultProfile, _profileHash, _bio);
		emit CreatorNameCreated(creatorCount, 0, msg.sender, _creatorName, _defaultProfile, _profileHash, _bio);
	}

//create image
  function uploadImage(string memory _imageHash, string memory _description) public {
	  //Make sure image hash exist
	  require(bytes(_imageHash).length > 0);
	  //Make sure description exists
	  require(bytes(_description).length > 0);
	  //Make sure uploader address exists
	  require(msg.sender != address(0x0));
	  //Add image to contract
	  //msg.sender: refers to the address of the person (or smart contract) who called the current function.
    creators[creatorIDs[msg.sender]].imageCount++;
    images[msg.sender].push(Image(creators[creatorIDs[msg.sender]].imageCount, _imageHash, _description, 0, msg.sender));
	  emit ImageCreated(creators[creatorIDs[msg.sender]].imageCount, _imageHash, _description, 0, msg.sender);
  }

//create profile image
  function uploadProfileImage(string memory _imageHash) public {
    require(bytes(_imageHash).length > 0);
    require(msg.sender != address(0x0));

    creators[creatorIDs[msg.sender]].profileHash = _imageHash;
  }

  function tipImageOwner(address creatorAddress, uint imageID) public payable {
	  Image memory _image = images[creatorAddress][imageID];
	  address payable _author = _image.author;
	  //pay the author by sending them ether
	  address(_author).transfer(msg.value);
	  //increment the tip amount
	  //update the image
	  images[creatorAddress][imageID].tipAmount += msg.value;
    	  //trigger an event
	  emit ImageTipped(_image.imageId, _image.hash, _image.description, _image.tipAmount, _author);
  }
}
