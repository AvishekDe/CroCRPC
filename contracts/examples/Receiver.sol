//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";
import "../../Seriality/src/Seriality.sol";

contract Receiver is ILayerZeroReceiver, Seriality {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);
    event ParsedMsg(int op1, int op2, string fn);
    event ExternalCall(int op1, int op2, int ans);

    ILayerZeroEndpoint public endpoint;
    int public ret;
    string public rec;

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function sendMsg(uint16 _dstChainId, bytes memory _destination, bytes memory _src, bytes memory payload) public payable {
        bytes memory remoteAndLocalAddresses = abi.encodePacked(_destination, _src);
        endpoint.send{value: msg.value}(_dstChainId, remoteAndLocalAddresses, payload, payable(msg.sender), address(this), bytes(""));
    }

    function unsetRet() external {
        ret = 0;
    }

    function parsePayload(bytes memory _payload) public {
        uint offset = 200;
        string memory temp = new string(32);
        string memory fn = new string(32);

        int op1;
        int op2;

        op2 = bytesToInt256(offset, _payload);
        offset -= sizeOfInt(256);

        op1 = bytesToInt256(offset, _payload);
        offset -= sizeOfInt(256);

        bytesToString(offset, _payload, bytes(fn));
        offset -= sizeOfString(temp);

        emit ParsedMsg(op1, op2, fn);
        ExtLibrary el = ExtLibrary(0x12C9fEB41E2Bc14937573aC02C41C0065e7F2AF6);

        if (keccak256(abi.encodePacked(fn)) == keccak256(abi.encodePacked("sum"))) {
            ret = el.getSum(op1, op2);
        } else if (keccak256(abi.encodePacked(fn)) == keccak256(abi.encodePacked("diff"))) {
            ret = el.getDiff(op1, op2);
        } else {
            // prod
            ret = el.getDiff(op1, op2);
        }

        emit ExternalCall(op1, op2, ret);
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
        // rec = string(_payload);
        // string memory statecheck = "statecheck";
        // if (keccak256(abi.encodePacked(statecheck)) == keccak256(abi.encodePacked(string(abi.encodePacked(_payload))))) {
        //     ret = "hellofromtheotherside";
        // }
        parsePayload(_payload);
        emit ReceiveMsg(_srcChainId, from, _payload);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(uint16 _dstChainId, address _userApplication, bytes calldata _payload, bool _payInZRO, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee) {
        return endpoint.estimateFees(_dstChainId, _userApplication, _payload, _payInZRO, _adapterParams);
    }
}

abstract contract ExtLibrary {
    function getSum(int a, int b) external pure virtual returns (int);

    function getDiff(int a, int b) external pure virtual returns (int);

    function getProduct(int a, int b) external pure virtual returns (int);
}
