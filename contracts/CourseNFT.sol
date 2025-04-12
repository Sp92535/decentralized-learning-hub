// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CourseNFT
 * @dev ERC1155 token representing educational courses
 */
contract CourseNFT is ERC1155, Ownable {
    using Strings for uint256;
    
    // Course struct to store course details
    struct Course {
        string name;
        string ipfsLink;
        uint256 price;
        address instructor;
        bool exists;
    }
    
    // Mapping from token ID to Course
    mapping(uint256 => Course) private _courses;
    
    // Total number of courses
    uint256 private _courseIdCounter;
    
    // List of all course IDs
    uint256[] private _allCourseIds;
    
    // Events
    event CourseCreated(uint256 indexed courseId, string name, address instructor, uint256 price);
    event CoursePurchased(uint256 indexed courseId, address buyer);
    
    constructor() ERC1155("") Ownable(msg.sender) {
        _courseIdCounter = 0;
    }
    
    /**
     * @dev Creates a new course
     * @param _courseName Name of the course
     * @param _ipfsLink IPFS link to course content
     * @param _price Price of the course in wei
     * @param _instructor Address of the course instructor
     * @return courseId The ID of the created course
     */
    function createCourse(
        string calldata _courseName,
        string calldata _ipfsLink,
        uint256 _price,
        address _instructor
    ) external returns (uint256) {
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        require(bytes(_ipfsLink).length > 0, "IPFS link cannot be empty");
        
        uint256 newCourseId = _courseIdCounter++;
        
        _courses[newCourseId] = Course({
            name: _courseName,
            ipfsLink: _ipfsLink,
            price: _price,
            instructor: _instructor,
            exists: true
        });
        
        _allCourseIds.push(newCourseId);
        
        // Mint a single token for the instructor (token ID = course ID)
        // This represents ownership/authorship of the course
        _mint(_instructor, newCourseId, 1, "");
        
        emit CourseCreated(newCourseId, _courseName, _instructor, _price);
        
        return newCourseId;
    }
    
    /**
     * @dev Allows a user to purchase a course
     * @param _courseId ID of the course to purchase
     */
    function purchaseCourse(uint256 _courseId, address buyer) external payable {
        Course memory course = _courses[_courseId];
        require(course.exists, "Course does not exist");
        require(msg.value == course.price, "Incorrect payment amount");
        require(balanceOf(buyer, _courseId) == 0, "Already purchased this course");
        
        // Transfer payment to instructor
        payable(course.instructor).transfer(msg.value);
        
        // Mint a token for the buyer (token ID = course ID)
        _mint(buyer, _courseId, 1, "");
        
        emit CoursePurchased(_courseId, buyer);
    }
    
    /**
     * @dev Returns URI for course metadata
     * @param _courseId The course ID
     */
    function uri(uint256 _courseId) public view override returns (string memory) {
        Course memory course = _courses[_courseId];
        require(course.exists, "URI query for nonexistent course");
        
        return course.ipfsLink;
    }
    
    /**
     * @dev Gets course details
     * @param _courseId The course ID
     */
    function getCourseDetails(uint256 _courseId) external view returns (
        string memory name,
        string memory ipfsLink,
        uint256 price,
        address instructor
    ) {
        Course memory course = _courses[_courseId];
        require(course.exists, "Course does not exist");
        
        return (
            course.name,
            course.ipfsLink,
            course.price,
            course.instructor
        );
    }
    
    /**
     * @dev Gets all course IDs
     */
    function getAllCourseIds() external view returns (uint256[] memory) {
        return _allCourseIds;
    }
    
    /**
     * @dev Checks if user has access to a course
     * @param _user Address of the user
     * @param _courseId ID of the course
     */
    function hasAccess(address _user, uint256 _courseId) external view returns (bool) {
        Course memory course = _courses[_courseId];
        if (!course.exists) {
            return false;
        }
        
        // User has access if they're the instructor or if they own the token
        return (course.instructor == _user || balanceOf(_user, _courseId) > 0);
    }
}