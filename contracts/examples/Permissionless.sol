//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "./AtomicSwap.sol";
import "hardhat/console.sol";

contract Permissionless is AtomicSwap {
    bytes32 public signature;

    constructor(
        address _endpoint,
        address _receiver,
        address _witness,
        uint _depth,
        bytes32 _signature
    ) AtomicSwap(_endpoint, _receiver) {
        // CS rd, rf
        signature = _signature;
    }

    function isRedeemable(uint32 _evidence) public override returns (bool verification) {
        return true;
    }

    function isRefundable(uint32 _evidence) public override returns (bool verification) {
        return true;
    }
}
