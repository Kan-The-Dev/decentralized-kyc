// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedKYC {
    struct User {
        address userAddress;
        string dataHash;
        bool isVerified;
    }

    mapping(address => User) public users;
    mapping(address => bool) public verifiers;

    event UserRegistered(address indexed userAddress, string dataHash);
    event UserVerified(address indexed userAddress, address indexed verifier);

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not an authorized verifier");
        _;
    }

    constructor() {
        verifiers[msg.sender] = true; // Contract deployer is an initial verifier
    }

    function registerUser(string memory dataHash) external {
        require(bytes(users[msg.sender].dataHash).length == 0, "User already registered");
        users[msg.sender] = User(msg.sender, dataHash, false);
        emit UserRegistered(msg.sender, dataHash);
    }

    function verifyUser(address userAddress) external onlyVerifier {
        require(bytes(users[userAddress].dataHash).length != 0, "User not registered");
        users[userAddress].isVerified = true;
        emit UserVerified(userAddress, msg.sender);
    }

    function addVerifier(address verifierAddress) external onlyVerifier {
        verifiers[verifierAddress] = true;
    }

    function removeVerifier(address verifierAddress) external onlyVerifier {
        verifiers[verifierAddress] = false;
    }
}
