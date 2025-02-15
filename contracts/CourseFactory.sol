// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Course.sol";

interface IUserFactory {
    function getUserAddress(address user) external view returns (address);
    function addBoughtCourse(address user, address courseAdd) external;
    function addOwnedCourse(address user, address courseAdd) external;
    function setCourseFactory(address _courseFactory) external;
}

contract CourseFactory {
    IUserFactory public userFactory;

    uint256 totalCourses;
    mapping(address => bool) allCourses;

    constructor(address _userFactory) {
        totalCourses = 0;
        userFactory = IUserFactory(_userFactory);
        userFactory.setCourseFactory(address(this));
    }

    function createCourse(
        string calldata _courseName,
        string calldata _ipfsLink,
        uint256 _price
    ) external {
        require(
            userFactory.getUserAddress(msg.sender) != address(0),
            "User not registered"
        );

        Course course = new Course(
            _courseName,
            _ipfsLink,
            payable(msg.sender),
            totalCourses++,
            _price
        );

        allCourses[address(course)] = true;
        userFactory.addOwnedCourse(msg.sender, address(course));
    }

    function buyCourse(address _courseAddress) external payable {
        require(
            userFactory.getUserAddress(msg.sender) != address(0),
            "User not registered"
        );

        Course(_courseAddress).buyCourse{value: msg.value}(msg.sender);
        userFactory.addBoughtCourse(msg.sender, _courseAddress);
    }
}
