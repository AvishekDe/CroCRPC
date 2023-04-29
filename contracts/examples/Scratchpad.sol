//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Scratchpad {
    bytes32 public hash;

    function genHash() external {
        hash = keccak256(abi.encodePacked(address(this)));
    }
}
