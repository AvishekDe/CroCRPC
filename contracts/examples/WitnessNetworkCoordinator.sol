//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";

contract WitnessNetworkCoordinator is ILayerZeroReceiver {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);
    event SentMsg(uint16 _destChainId, address _to, bytes _payload);

    ILayerZeroEndpoint public endpoint;

    enum State {
        PUBLISHED,
        REDEEM_AUTHORIZED,
        REFUND_AUTHORIZED
    }

    uint public participants;
    address[] public pk;
    uint16[] public chain_ids;
    bytes32 public multisign;
    State public state;
    address[] public headers;
    string public receivedMsg;

    constructor(address _endpoint, uint _participants, address[] memory _pk, bytes32 _multisign, address[] memory _headers) {
        endpoint = ILayerZeroEndpoint(_endpoint);
        participants = _participants;
        pk = _pk;
        multisign = _multisign;
        state = State.PUBLISHED;
        headers = _headers;
    }

    function multiCastState() public payable {
        for (uint i = 0; i < participants; i++) {
            address a = pk[i];
            uint16 ci = chain_ids[i];
            while (endpoint.isSendingPayload()) {} // Avoids the reentrancy guard
            sendMsg(ci, abi.encodePacked(a), abi.encodePacked(address(this)), abi.encodePacked(uint(state)));
            emit SentMsg(ci, a, bytes("State Sent to Participants"));
        }
    }

    function authorizeRedeem(uint32 _evidence) external {
        if (state == State.PUBLISHED && pk.length == participants && verifyContracts(_evidence)) {
            state = State.REDEEM_AUTHORIZED;
        }
        multiCastState();
    }

    function authorizeRefund() external {
        if (state == State.PUBLISHED) {
            state = State.REFUND_AUTHORIZED;
        }
        multiCastState();
    }

    function verifyContracts(uint32 _evidence) internal returns (bool valid) {
        bool valid = true;
        return valid;
    }

    function addPublicKey(bytes memory member_pk, uint16 member_ci) external {
        address key;
        assembly {
            key := mload(add(member_pk, 20))
        }
        pk.push(key);
        chain_ids.push(member_ci);
    }

    function sendMsg(uint16 _dstChainId, bytes memory _destination, bytes memory _src, bytes memory payload) public payable {
        bytes memory remoteAndLocalAddresses = abi.encodePacked(_destination, _src);
        endpoint.send{value: msg.value / (participants + 1)}(_dstChainId, remoteAndLocalAddresses, payload, payable(msg.sender), address(this), bytes(""));
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
        //Is it a state check call
        receivedMsg = string(_payload);
        string memory statecheck = "statecheck";
        // if (keccak256(abi.encodePacked(statecheck)) == keccak256(abi.encodePacked(string(abi.encodePacked(_payload))))) {
        //     receivedMsg = "insideIf";
        //     sendMsg(_srcChainId, abi.encodePacked(from), abi.encodePacked(address(this)), bytes("fool"));
        //     receivedMsg = "sent";
        // }
        emit ReceiveMsg(_srcChainId, from, _payload);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(uint16 _dstChainId, address _userApplication, bytes calldata _payload, bool _payInZRO, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee) {
        return endpoint.estimateFees(_dstChainId, _userApplication, _payload, _payInZRO, _adapterParams);
    }
}
