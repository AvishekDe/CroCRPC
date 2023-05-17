//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";
import "../../Seriality/src/Seriality.sol";

contract Voter is ILayerZeroReceiver, Seriality {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);
    event SentMsg(uint16 _destChainID, address _coordinator, bytes _payload);

    // Dependencies
    ILayerZeroEndpoint public endpoint;

    // App specific data members
    mapping(address => string) public votingRecord;
    string public transactionID;
    string public name = "Voter-Mumbai";

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function castVote(address _topic, uint16 _destChainID, uint16 index) external payable {
        bytes memory buffer = new bytes(200); // should match offset
        // Serializing
        uint offset = 200; // size of maximum variable -- to be coordinated

        uintToBytes(offset, index, buffer);
        offset -= sizeOfUint(16);

        while (endpoint.isSendingPayload()) {} // Avoids the reentrancy guard
        sendMsg(_destChainID, abi.encodePacked(_topic), abi.encodePacked(address(this)), buffer);
        emit SentMsg(_destChainID, _topic, buffer);
    }

    function sendMsg(uint16 _dstChainId, bytes memory _destination, bytes memory _src, bytes memory payload) public payable {
        bytes memory remoteAndLocalAddresses = abi.encodePacked(_destination, _src);
        endpoint.send{value: msg.value}(_dstChainId, remoteAndLocalAddresses, payload, payable(msg.sender), address(this), bytes(""));
    }

    function lzReceive(uint16 _srcChainId, bytes memory _from, uint64, bytes memory _payload) external override {
        require(msg.sender == address(endpoint));
        address from;
        assembly {
            from := mload(add(_from, 20))
        }
        if (keccak256(abi.encodePacked((_payload))) == keccak256(abi.encodePacked((bytes10("ff"))))) {
            endpoint.receivePayload(1, bytes(""), address(0x0), 1, 1, bytes(""));
        }
        transactionID = string(_payload);
        votingRecord[from] = transactionID;
        emit ReceiveMsg(_srcChainId, from, _payload);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(uint16 _dstChainId, address _userApplication, bytes calldata _payload, bool _payInZRO, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee) {
        return endpoint.estimateFees(_dstChainId, _userApplication, _payload, _payInZRO, _adapterParams);
    }
}
