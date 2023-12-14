// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract BoardgameNFT is ERC721 {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256[]) private _ownedTokens;
    string private baseTokenURI;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        baseTokenURI = "https://firebasestorage.googleapis.com/v0/b/planar-hangout-366503.appspot.com/o/bgt_meta%2F";
    }

    function mint(address to, string memory uri) public {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _ownedTokens[to].push(tokenId);
    }

    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        _tokenURIs[tokenId] = uri;
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    // Override the transfer functions to keep track of token ownership
    function _transfer(address from, address to, uint256 tokenId) internal override {
        super._transfer(from, to, tokenId);
        _removeTokenFromOwnerEnumeration(from, tokenId);
        _ownedTokens[to].push(tokenId);
    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        uint256 tokenIndex;

        // Find the token to remove
        for (uint256 i = 0; i < _ownedTokens[from].length; i++) {
            if (_ownedTokens[from][i] == tokenId) {
                tokenIndex = i;
                break;
            }
        }

        // Swap the token with the last one in the list and remove it
        if (tokenIndex != lastTokenIndex) {
            _ownedTokens[from][tokenIndex] = _ownedTokens[from][lastTokenIndex];
        }
        _ownedTokens[from].pop();
    }
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId), ".json?alt=media"));
    }
}
