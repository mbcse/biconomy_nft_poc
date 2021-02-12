// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";

/**
 * @title Biconomy_nft_poc
 * @notice An ERC1155 compliant NFT token
 * @author matt@mattprimeonline.com
 */
contract Biconomy_nft_poc is ERC1155, Ownable, BaseRelayRecipient {

    // Hashes of NFT pictures on IPFS
    string[] public hashes;

    // Mapping for enforcing unique hashes
    mapping(string => bool) _hashExists;

    // Mapping from ipfs picture hash to NFT tokenID
    mapping (string => uint256) private _hashToken;

    event NFTMinted(address creator, uint256 tokenId);

    constructor() public ERC1155("https://exampleurl/tokenmetadata/{id}.json") {
      trustedForwarder = 0x4D373d1B9a0367219a5f6547B8DfaC39f846F6a9;
    }

    function setTrustedForwarder(address _trustedForwarder) public {
      trustedForwarder = _trustedForwarder;
    }


    /**
     * @notice Mints a new NFT
     * @param _hash IPFS picture hash of the NFT
     */
    function mint(string memory _hash) public {
        require(!_hashExists[_hash], "Token with this hash is already minted");

        hashes.push(_hash);
        uint256 _id = hashes.length - 1;
        _mint(_msgSender(), _id, 1, "");

        _hashExists[_hash] = true;
        _hashToken[_hash] = _id;

        emit NFTMinted(_msgSender(), _id);
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

    function versionRecipient() external override view returns (string memory) {
      return "V4";
    }

    /**
     * return the sender of this call.
     * if the call came through our trusted forwarder, return the original sender.
     * otherwise, return `msg.sender`.
     * should be used in the contract anywhere instead of msg.sender
     */
    function _msgSender() internal override(BaseRelayRecipient,Context) view returns (address payable ret) {
        if (msg.data.length >= 24 && isTrustedForwarder(msg.sender)) {
            // At this point we know that the sender is a trusted forwarder,
            // so we trust that the last bytes of msg.data are the verified sender address.
            // extract sender address from the end of msg.data
            assembly {
                ret := shr(96,calldataload(sub(calldatasize(),20)))
            }
        } else {
            return msg.sender;
        }
    }

    /**
     * return the msg.data of this call.
     * if the call came through our trusted forwarder, then the real sender was appended as the last 20 bytes
     * of the msg.data - so this method will strip those 20 bytes off.
     * otherwise, return `msg.data`
     * should be used in the contract instead of msg.data, where the difference matters (e.g. when explicitly
     * signing or hashing the
     */
      function _msgData() internal override(BaseRelayRecipient,Context) view returns (bytes memory ret) {
          if (msg.data.length >= 24 && isTrustedForwarder(msg.sender)) {
              // At this point we know that the sender is a trusted forwarder,
              // we copy the msg.data , except the last 20 bytes (and update the total length)
              assembly {
                  let ptr := mload(0x40)
                  // copy only size-20 bytes
                  let size := sub(calldatasize(),20)
                  // structure RLP data as <offset> <length> <bytes>
                  mstore(ptr, 0x20)
                  mstore(add(ptr,32), size)
                  calldatacopy(add(ptr,64), 0, size)
                  return(ptr, add(size,64))
              }
          } else {
              return msg.data;
          }
      }


}
