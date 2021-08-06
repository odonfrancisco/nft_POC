// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./AccessToken.sol";

contract VotingContract {
  event ContractAccessed (
    uint tokenId,
    address owner
  );
  
  event TokenCreated (
    uint tokenId,
    address owner,
    string contractAddr
  );

  struct AccessRef {
    uint tokenId;
    bool isAdmin;
  }

  string public name;
  bool adminExists;
  AccessToken public accessToken;
  mapping(uint => AccessRef) public approvedTokens;
  mapping(address => AccessRef) public tokenOwners;

  constructor(string memory _name, address tokenAddr) {
    name = _name;
    // accessToken = new AccessToken(_name, _tokenSymbol);
    accessToken = AccessToken(tokenAddr);
    // Trying to convert address into a string to save as tokenURI
    // string memory chreast = string(bytes20(address(this)));
  }

  function getAccessRef(uint tokenId) external view returns(AccessRef memory){
    return approvedTokens[tokenId];
  }

  function getOwnerToken() external view returns(AccessRef memory){
    return tokenOwners[msg.sender];
  }

  function generateAdmin(string memory contractAddr) external {
    require(!adminExists, "Admin already exists for this contract");
    uint tokenId = accessToken.mintToken(msg.sender, contractAddr);
    AccessRef memory ar = AccessRef(
      tokenId,
      true
    );
    approvedTokens[tokenId] = ar;
    tokenOwners[msg.sender] = ar;    
    adminExists = true;
    emit TokenCreated(tokenId, msg.sender, accessToken.tokenURI(tokenId));
  }

  function generateAccessToken(address approved, string memory contractAddr) external onlyAdmin() {
    uint balanceOf = accessToken.balanceOf(approved);
    require(balanceOf == 0, 
      "An address may only own one Access Token");
    uint tokenId = accessToken.mintToken(approved, contractAddr);
    AccessRef memory ar = AccessRef(
      tokenId,
      false
    );
    approvedTokens[tokenId] = ar;
    tokenOwners[approved] = ar;
    emit TokenCreated(tokenId, approved, accessToken.tokenURI(tokenId));
  }

  function vote() external onlyApproved() {
    uint tokenId = accessToken.tokenOfOwnerByIndex(msg.sender, 0);
    emit ContractAccessed(
      tokenId,
      msg.sender
    );
  }

  /* To set someone as admin, will exchange that NFT 
  with address who wil be admin */

  modifier onlyAdmin() {
    uint balanceOf = accessToken.balanceOf(msg.sender);
    require(balanceOf == 1,
      "Only admin may perform this action");
    uint ownerIndex = accessToken.tokenOfOwnerByIndex(msg.sender, 0);
    require(approvedTokens[ownerIndex].isAdmin == true,
      "Only admin may perform this action");
    _;
  }
  
  modifier onlyApproved() {
    uint balanceOf = accessToken.balanceOf(msg.sender);
    require(balanceOf == 1,
      "Must hold an access token to perform this action");
    _;
  }
  
}
