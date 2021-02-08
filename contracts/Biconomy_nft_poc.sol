// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Biconomy_nft_poc
 * @notice An ERC1155 compliant NFT token
 * @author matt@mattprimeonline.com
 */
contract Biconomy_nft_poc is ERC1155, Ownable {

    // Hashes of NFT pictures on IPFS
    string[] public hashes;

    // Mapping for enforcing unique hashes
    mapping(string => bool) _hashExists;

    // Mapping from ipfs picture hash to NFT tokenID
    mapping (string => uint256) private _hashToken;

    event NFTMinted(address creator, uint256 tokenId);

    constructor() public ERC1155("https://exampleurl/tokenmetadata/{id}.json") {}

    /**
     * @notice Mints a new NFT
     * @param _hash IPFS picture hash of the NFT
     */
    function mint(string memory _hash) public {
        require(!_hashExists[_hash], "Token with this hash is already minted");

        hashes.push(_hash);
        uint256 _id = hashes.length - 1;
        _mint(msg.sender, _id, 1, "");

        _hashExists[_hash] = true;
        _hashToken[_hash] = _id;

        emit NFTMinted(msg.sender, _id);
    }

    /**
     * @notice Returns the TokenID of nft
     * @return tokenID of the nft
     */
    function getTokenID(string memory _hash) public view returns (uint256 tokenID) {
        return _hashToken[_hash];
    }

    /**
     * @notice Returns the number of minted nfts
     * @return count the number of nfts
     */
    function getNftCount() public view returns (uint256 count) {
        return hashes.length;
    }
}
