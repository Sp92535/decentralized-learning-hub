// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Course {
    string public courseName;
    string public ipfsLink;
    uint256 public courseId;
    uint256 public price;

    address payable public instructor;

    mapping(address => bool) buyers;
    address[] buyersList;

    constructor(
        string memory _courseName,
        string memory _ipfsLink,
        address payable _instructor,
        uint _courseId,
        uint256 _price
    ) {
        courseName = _courseName;
        ipfsLink = _ipfsLink;
        instructor = _instructor;
        courseId = _courseId;
        price = _price;
    }

    function buyCourse(address _buyer) external payable {
        require(msg.value == price, "Pay the exact amount.");
        require(!buyers[_buyer], "Course Already Bought");

        instructor.transfer(price);

        buyers[_buyer] = true;
        buyersList.push(_buyer);
    }
}
