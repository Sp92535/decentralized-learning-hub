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
    address[] allCourseAddress;

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
        allCourseAddress.push(address(course));
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

    function getAllCourses()
        external
        view
        returns (
            address[] memory,
            string[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        uint256 courseCount = allCourseAddress.length;

        address[] memory courseAddresses = new address[](courseCount);
        string[] memory courseNames = new string[](courseCount);
        string[] memory ipfsLinks = new string[](courseCount);
        uint256[] memory prices = new uint256[](courseCount);

        for (uint256 i = 0; i < courseCount; i++) {
            Course course = Course(allCourseAddress[i]);
            (
                courseAddresses[i],
                courseNames[i],
                ipfsLinks[i],
                prices[i]
            ) = course.getData();
        }

        return (courseAddresses, courseNames, ipfsLinks, prices);
    }
}
