//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";

contract WitnessNetworkCoordinator is ILayerZeroReceiver {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);

    ILayerZeroEndpoint public endpoint;

    enum State {
        PUBLISHED,
        REDEEM_AUTHORIZED,
        REFUND_AUTHORIZED
    }
    address[] public pk;
    bytes32 public multisign;
    State public state;
    address[] public headers;

    constructor(
        address _endpoint,
        address[] memory _pk,
        bytes32 _multisign,
        address[] memory _headers
    ) {
        endpoint = ILayerZeroEndpoint(_endpoint);
        pk = _pk;
        multisign = _multisign;
        state = State.PUBLISHED;
        headers = _headers;
    }

    function authorizeRedeem(uint32 _evidence) external {
        if (state == State.PUBLISHED && verifyContracts(_evidence)) {
            state = State.REDEEM_AUTHORIZED;
        }
    }

    function authorizeRefund() external {
        if (state == State.PUBLISHED) {
            state = State.REFUND_AUTHORIZED;
        }
    }

    function verifyContracts(uint32 _evidence) internal returns (bool valid) {
        bool valid = true;
        return valid;
    }

    function sendMsg(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _src,
        bytes calldata payload
    ) public payable {
        bytes memory remoteAndLocalAddresses = abi.encodePacked(_destination, _src);
        endpoint.send{value: msg.value}(_dstChainId, remoteAndLocalAddresses, payload, payable(msg.sender), address(this), bytes(""));
    }

    function lzReceive(
        uint16 _srcChainId,
        bytes memory _from,
        uint64,
        bytes memory _payload
    ) external override {
        require(msg.sender == address(endpoint));
        address from;
        assembly {
            from := mload(add(_from, 20))
        }
        if (keccak256(abi.encodePacked((_payload))) == keccak256(abi.encodePacked((bytes10("ff"))))) {
            endpoint.receivePayload(1, bytes(""), address(0x0), 1, 1, bytes(""));
        }
        emit ReceiveMsg(_srcChainId, from, _payload);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParams
    ) external view returns (uint nativeFee, uint zroFee) {
        return endpoint.estimateFees(_dstChainId, _userApplication, _payload, _payInZRO, _adapterParams);
    }
}
