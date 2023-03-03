//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";
import "../../Seriality/src/Seriality.sol";

contract Sender is ILayerZeroReceiver, Seriality {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);
    event SentMsg(uint16 _destChainID, address _coordinator, bytes _payload);

    ILayerZeroEndpoint public endpoint;
    address public coordinator;
    string public ret;
    uint16 public destChainID;

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function updateCoordinator(address _coordinator, uint16 _destChainID) external {
        coordinator = _coordinator;
        destChainID = _destChainID;
    }

    function client(string memory _fn, int _op1, int _op2) external payable {
        // Mandatory args = FunctionName, ...Args (Mode to be supported later)
        bytes memory buffer = new bytes(200);
        string memory fn = new string(32);
        fn = _fn;
        int op1 = _op1;
        int op2 = _op2;

        // Serializing
        uint offset = 200; // size of maximum variable -- to be coordinated

        intToBytes(offset, op2, buffer);
        offset -= sizeOfInt(256);

        intToBytes(offset, op1, buffer);
        offset -= sizeOfInt(256);

        stringToBytes(offset, bytes(fn), buffer);
        offset -= sizeOfString(fn);

        // Send buffer as payload
        while (endpoint.isSendingPayload()) {} // Avoids the reentrancy guard
        sendMsg(destChainID, abi.encodePacked(coordinator), abi.encodePacked(address(this)), buffer);
        emit SentMsg(destChainID, coordinator, buffer);
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
        ret = string(_payload);
        emit ReceiveMsg(_srcChainId, from, _payload);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(uint16 _dstChainId, address _userApplication, bytes calldata _payload, bool _payInZRO, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee) {
        return endpoint.estimateFees(_dstChainId, _userApplication, _payload, _payInZRO, _adapterParams);
    }
}
