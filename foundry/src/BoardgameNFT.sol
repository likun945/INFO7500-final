// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract BoardgameNFT is ERC721 {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenIdCounter++;
    }

    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}
