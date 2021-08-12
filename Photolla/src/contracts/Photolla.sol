pragma solidity ^0.5.16;

contract Photolla {
  string public name = "Photolla";
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  //Store post
  struct Image {
    uint  id;
    string hash;
    string description;
    uint tipAmount;
    address author;
  }

  event ImageCreated(
    uint  id,
    string hash,
    string description,
    uint tipAmount,
    address author
  );

  //upload post
  function uploadImage(string memory _imgHash, string memory _description) public {
    require(bytes(_imgHash).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender != address(0x0));
    imageCount++;
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
  }

}

