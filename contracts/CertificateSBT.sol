// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./CourseNFT.sol";
contract CertificateSBT is Ownable {
    CourseNFT public courseNFT;

    struct Certificate {
        string certificateId;
        string uri;
        bool valid;
    }

    constructor() Ownable(msg.sender) {
    }

    // user => courseId => certificate
    mapping(string => Certificate) public allCertificates;
    mapping(address => mapping(uint256 => Certificate)) public certificates;

    event Attested(address indexed user, uint256 indexed courseId, string uri);
    event Revoked(address indexed user, uint256 indexed courseId);

    /**
     * @dev Sets the CourseNFT contract address
     * @param _courseNFT Address of the CourseNFT contract
     */
    function setCourseNFT(address _courseNFT) external onlyOwner {
        courseNFT = CourseNFT(_courseNFT);
    }

    function attest(
        address user,
        uint256 courseId,
        string calldata uri,
        string calldata certificateId
    ) external returns (string memory) {
        require(courseNFT.isBuyer(user, courseId),"Not original buyer if course.");
        require(
            bytes(certificates[user][courseId].uri).length == 0,
            "Already attested"
        );
        certificates[user][courseId] = Certificate(certificateId, uri, true);
        allCertificates[certificateId] = certificates[user][courseId];
        emit Attested(user, courseId, uri);
        return certificateId;
    }

    function revoke(address user, uint256 courseId) external {
        require(certificates[user][courseId].valid, "Already revoked");
        certificates[user][courseId].valid = false;
        string memory id = certificates[user][courseId].certificateId;
        allCertificates[id].valid = false;
        emit Revoked(user, courseId);
    }

    function getCertificate(
        address user,
        uint256 courseId
    ) external view returns (string memory) {
        require(
            certificates[user][courseId].valid,
            "Certificate invalid or revoked"
        );
        return certificates[user][courseId].certificateId;
    }

    function getCertificateURL(
        string calldata certificateId
    ) external view returns (string memory) {
        require(
            allCertificates[certificateId].valid,
            "Certificate invalid or revoked"
        );
        return allCertificates[certificateId].uri;
    }
}
