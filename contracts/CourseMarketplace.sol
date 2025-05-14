// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CourseNFT.sol";
import "./UserRegistry.sol";
import "./CertificateSBT.sol";

/**
 * @title CourseMarketplace
 * @dev Main contract to interact with the course marketplace
 */
contract CourseMarketplace is Ownable {
    // Contracts
    CourseNFT public courseNFT;
    UserRegistry public userRegistry;
    CertificateSBT public certificateSBT;

    // Events
    event CourseCreated(uint256 indexed courseId, address indexed instructor);
    event CoursePurchased(uint256 indexed courseId, address indexed buyer);

    constructor() Ownable(msg.sender) {
        // Initialize contracts
        courseNFT = new CourseNFT();
        userRegistry = new UserRegistry();
        certificateSBT = new CertificateSBT();
        // Link contracts
        certificateSBT.setCourseNFT(address(courseNFT));
        userRegistry.setCourseNFT(address(courseNFT));
    }

    /**
     * @dev Creates a new course
     * @param _courseName Name of the course
     * @param _ipfsLink IPFS link to course content
     * @param _price Price of the course in wei
     */
    function createCourse(
        string calldata _courseName,
        string calldata _ipfsLink,
        uint256 _price
    ) external returns (uint256) {
        // Check if user is registered
        require(userRegistry.isRegistered(msg.sender), "User not registered");
        require(userRegistry.isInstructor(msg.sender), "User not instructor");

        // Create the course
        uint256 courseId = courseNFT.createCourse(
            _courseName,
            _ipfsLink,
            _price,
            msg.sender
        );

        emit CourseCreated(courseId, msg.sender);

        return courseId;
    }

    /**
     * @dev Allows a user to purchase a course
     * @param _courseId ID of the course to purchase
     */
    function purchaseCourse(uint256 _courseId) external payable {
        // Check if user is registered
        require(userRegistry.isRegistered(msg.sender), "User not registered");

        // Purchase the course
        courseNFT.purchaseCourse{value: msg.value}(_courseId, msg.sender);

        emit CoursePurchased(_courseId, msg.sender);
    }

    /**
     * @dev Registers a new user
     * @param _username Username for the user
     */
    function registerUser(
        string calldata _username,
        bool _isInstructor
    ) external {
        userRegistry.register(msg.sender, _username, _isInstructor);
    }

    function loginUser() external view returns (address, string memory, bool isInstructor) {
        return userRegistry.getUserData(msg.sender);
    }

    /**
     * @dev Gets all available courses
     * @return courseIds Array of all course IDs
     * @return names Array of course names
     * @return prices Array of course prices
     * @return instructors Array of course instructors
     */
    function getAllCourses()
        external
        view
        returns (
            uint256[] memory courseIds,
            string[] memory names,
            uint256[] memory prices,
            address[] memory instructors
        )
    {
        uint256[] memory allCourseIds = courseNFT.getAllCourseIds();
        uint256 courseCount = allCourseIds.length;

        names = new string[](courseCount);
        prices = new uint256[](courseCount);
        instructors = new address[](courseCount);

        for (uint256 i = 0; i < courseCount; i++) {
            (
                names[i], // ipfsLink (omitted to reduce data size)
                ,
                prices[i],
                instructors[i]
            ) = courseNFT.getCourseDetails(allCourseIds[i]);
        }

        return (allCourseIds, names, prices, instructors);
    }

    /**
     * @dev Gets courses purchased by the caller
     */
    function getPurchasedCourses()
        external
        view
        returns (
            uint256[] memory courseIds,
            string[] memory names,
            uint256[] memory prices,
            address[] memory instructors,
            string[] memory ipfsLinks
        )
    {
        uint256[] memory purchasedCourseIds = userRegistry.getPurchasedCourses(
            msg.sender
        );

        uint256 courseCount = purchasedCourseIds.length;

        names = new string[](courseCount);
        prices = new uint256[](courseCount);
        instructors = new address[](courseCount);
        ipfsLinks = new string[](courseCount);

        for (uint256 i = 0; i < courseCount; i++) {
            (
                names[i], // ipfsLink (omitted to reduce data size)
                ipfsLinks[i],
                prices[i],
                instructors[i]
            ) = courseNFT.getCourseDetails(purchasedCourseIds[i]);
        }

        return (purchasedCourseIds, names, prices, instructors, ipfsLinks);
    }

    /**
     * @dev Gets courses created by the caller
     */
    function getCreatedCourses()
        external
        view
        returns (
            uint256[] memory courseIds,
            string[] memory names,
            uint256[] memory prices,
            address[] memory instructors,
            string[] memory ipfsLinks
        )
    {
        uint256[] memory createdCourseIds = userRegistry.getCreatedCourses(
            msg.sender
        );

        uint256 courseCount = createdCourseIds.length;

        names = new string[](courseCount);
        prices = new uint256[](courseCount);
        instructors = new address[](courseCount);
        ipfsLinks = new string[](courseCount);

        for (uint256 i = 0; i < courseCount; i++) {
            (
                names[i], // ipfsLink (omitted to reduce data size)
                ipfsLinks[i],
                prices[i],
                instructors[i]
            ) = courseNFT.getCourseDetails(createdCourseIds[i]);
        }

        return (createdCourseIds, names, prices, instructors, ipfsLinks);
    }

    function issueCertificate(
        uint256 courseId,
        string calldata uri,
        string calldata certificateId
    ) external returns (string memory) {
        // Issue the certificate
        return certificateSBT.attest(msg.sender, courseId, uri,certificateId);
    }

    function getCertificate(uint256 courseId) external view returns (string memory) {
        // Get the certificate
        return certificateSBT.getCertificate(msg.sender, courseId);
    }

    function getCertificateURL(
        string calldata certificateId
    ) external view returns (string memory) {
        // Get the certificate
        return certificateSBT.getCertificateURL(certificateId);
    }
}
