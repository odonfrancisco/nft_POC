// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import '@openzeppelin/contracts/utils/Counters.sol';

contract AccessToken is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  constructor() ERC721("AccessToken", "ACTK") {}

  function mintToken(address approvedAddr, address vc) external returns(uint) {
    uint newTokenId = _tokenIds.current();
    _mint(approvedAddr, newTokenId);    
    // Could potentially make this work to send you to a certain slug of the URL
    // Will worry about later
    // _setTokenURI(newTokenId, contractAddress);
    _tokenIds.increment();

    return(newTokenId);
  }
}
