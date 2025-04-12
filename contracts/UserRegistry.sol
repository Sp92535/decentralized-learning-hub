// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CourseNFT.sol";
/**
 * @title UserRegistry
 * @dev Contract for registering users
 */
contract UserRegistry is Ownable {
    // User struct
    struct User {
        uint256 userId;
        address userAddress;
        string username;
        bool registered;
    }
    
    // CourseNFT contract reference
    CourseNFT public courseNFT;
    
    // User data
    mapping(address => User) public users;
    uint256 public totalUsers;
    
    // Events
    event UserRegistered(address indexed userAddress, string username, uint256 userId);
    
    constructor() Ownable(msg.sender) {
        totalUsers = 0;
    }
    
    /**
     * @dev Sets the CourseNFT contract address
     * @param _courseNFT Address of the CourseNFT contract
     */
    function setCourseNFT(address _courseNFT) external onlyOwner {
        courseNFT = CourseNFT(_courseNFT);
    }
    
    /**
     * @dev Registers a new user
     * @param _username Username for the user
     */
    function register(address _userAdd, string calldata _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(!users[_userAdd].registered, "User already registered");
        
        users[_userAdd] = User({
            userId: totalUsers++,
            userAddress: _userAdd,
            username: _username,
            registered: true
        });
        
        emit UserRegistered(_userAdd, _username, totalUsers - 1);
    }
    
    /**
     * @dev Returns user data if registered
     */
    function getUserData(address _userAdd) external view returns (address , string memory) {
        require(users[_userAdd].registered, "User not registered");
        return (_userAdd , users[_userAdd].username);
    }
    
    /**
     * @dev Checks if an address is registered
     * @param _user Address to check
     */
    function isRegistered(address _user) external view returns (bool) {
        return users[_user].registered;
    }
    
    /**
     * @dev Gets purchased courses for the caller
     * @return courseIds Array of course IDs purchased by the user
     */
    function getPurchasedCourses(address _userAdd) external view returns (uint256[] memory) {
        require(users[_userAdd].registered, "User not registered");
        
        // Get all course IDs
        uint256[] memory allCourses = courseNFT.getAllCourseIds();
        
        // Count how many courses the user has purchased
        uint256 count = 0;
        for (uint256 i = 0; i < allCourses.length; i++) {
            if (courseNFT.hasAccess(_userAdd, allCourses[i])) {
                count++;
            }
        }
        
        // Create the result array
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        // Fill the result array
        for (uint256 i = 0; i < allCourses.length; i++) {
            if (courseNFT.hasAccess(_userAdd, allCourses[i])) {
                result[resultIndex] = allCourses[i];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Gets courses created by the caller
     * @return courseIds Array of course IDs created by the user
     */
    function getCreatedCourses(address _userAdd) external view returns (uint256[] memory) {
        require(users[_userAdd].registered, "User not registered");
        
        // Get all course IDs
        uint256[] memory allCourses = courseNFT.getAllCourseIds();
        
        // Count how many courses the user has created
        uint256 count = 0;
        for (uint256 i = 0; i < allCourses.length; i++) {
            (,,, address instructor) = courseNFT.getCourseDetails(allCourses[i]);
            if (instructor == _userAdd) {
                count++;
            }
        }
        
        // Create the result array
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        // Fill the result array
        for (uint256 i = 0; i < allCourses.length; i++) {
            (,,, address instructor) = courseNFT.getCourseDetails(allCourses[i]);
            if (instructor == _userAdd) {
                result[resultIndex] = allCourses[i];
                resultIndex++;
            }
        }
        
        return result;
    }
}