// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./AccessToken.sol";

contract VotingContract {

  struct AccessRef {
    uint tokenId;
    bool isAdmin;
  }

  string public name;
  AccessToken public accessToken;
  mapping(uint => AccessRef) approvedTokens;

  constructor(string memory _name) {
    name = _name;
    accessToken = new AccessToken();
    uint tokenId = accessToken.mintToken(msg.sender, address(this));
    approvedTokens[tokenId] = AccessRef(
      tokenId,
      true
    );
  }

  function generateAccessToken(address approved) external {
    uint tokenId = accessToken.mintToken(approved, address(this));
    approvedTokens[tokenId] = AccessRef(
      tokenId,
      false
    );
  }

  /* To set someone as admin, will exchange that NFT 
  with address who wil be admin */
}
