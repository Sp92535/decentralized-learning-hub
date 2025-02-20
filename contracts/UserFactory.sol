// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract UserFactory {
    struct User {
        // User specific fields
        uint256 userId;
        address userAddress;
        string username;
    }
    address courseFactory;

    mapping(address => User) public userDB;
    mapping(address => address[]) public userBoughtCourses;
    mapping(address => address[]) public instructorOwnedCourses;

    uint256 public totalUsers;

    constructor() {
        totalUsers = 0;
    }

    function setCourseFactory(address _courseFactory) external {
        require(courseFactory == address(0), "CourseFactory already set");
        courseFactory = _courseFactory;
    }

    function register(string calldata _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(
            userDB[msg.sender].userAddress == address(0),
            "User already exists"
        );

        userDB[msg.sender] = User({
            userId: totalUsers++,
            userAddress: msg.sender,
            username: _username
        });
    }

    function login() external view returns (User memory) {
        require(
            userDB[msg.sender].userAddress != address(0),
            "User not registered"
        );
        return userDB[msg.sender];
    }

    function getUserAddress(address user) external view returns (address) {
        return userDB[user].userAddress;
    }

    modifier onlyCourseFactory() {
        require(msg.sender == courseFactory, "Only CourseFactory can call");
        _;
    }

    function addBoughtCourse(
        address user,
        address courseAdd
    ) external onlyCourseFactory {
        userBoughtCourses[user].push(courseAdd);
    }

    function addOwnedCourse(
        address user,
        address courseAdd
    ) external onlyCourseFactory {
        instructorOwnedCourses[user].push(courseAdd);
    }

    function getOwnedCourses() external view returns (address[] memory) {
        return instructorOwnedCourses[msg.sender];
    }

    function getBoughtCourses() external view returns (address[] memory) {
        return userBoughtCourses[msg.sender];
    }
}
