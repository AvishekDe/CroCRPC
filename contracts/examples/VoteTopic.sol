//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";
import "../../Seriality/src/Seriality.sol";

contract VoteTopic is ILayerZeroReceiver, Seriality {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);
    event ReceivedVote(uint index, bytes32 _from);
    event ExternalCall(int op1, int op2, int ans);

    // Dependencies
    ILayerZeroEndpoint public endpoint;
    string public rec;

    // Needed by the daemon to send back results
    mapping(address => uint16) public chainIDmap;
    mapping(address => uint) public pendingResultMap;
    address[] public pendingAddresses;

    // App specific data members
    string public question = "Who will win Premier League?";
    string[] public options = ["Man City", "Arsenal", "Liverpool", "Man United"];
    uint8[] public voteCounter = [0, 0, 0, 0];
    mapping(address => bool) private participants;
    mapping(uint => uint16) public recordedVotes;

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function clearPendingResults() external {
        while (countPending() > 0) {
            deleteFirstResult();
        }
    }

    function sendMsg(uint16 _dstChainId, bytes memory _destination, bytes memory _src, bytes memory payload) public payable {
        bytes memory remoteAndLocalAddresses = abi.encodePacked(_destination, _src);
        endpoint.send{value: msg.value}(_dstChainId, remoteAndLocalAddresses, payload, payable(msg.sender), address(this), bytes(""));
    }

    function countPending() public view returns (uint) {
        return pendingAddresses.length;
    }

    function deleteFirstResult() public {
        //delete
        uint pendingResults = countPending();
        address a = pendingAddresses[0];
        for (uint i = 0; i < pendingResults - 1; i++) {
            pendingAddresses[i] = pendingAddresses[i + 1];
        }

        delete pendingResultMap[a];
        pendingAddresses.pop();
    }

    function getFirstResult() external view returns (address, uint16, uint) {
        uint pendingResults = countPending();
        require(pendingResults > 0);
        address a = pendingAddresses[0];
        uint16 cid = chainIDmap[a];
        uint transactionID = pendingResultMap[a];
        return (a, cid, transactionID);
    }

    function parsePayload(bytes memory _payload, address from, uint16 _srcChainID) public {
        chainIDmap[from] = _srcChainID;

        uint offset = 200;
        uint16 index;

        index = bytesToUint16(offset, _payload);
        offset -= sizeOfUint(16);

        uint transactionID = registerVote(from, index);

        pendingAddresses.push(from);
        pendingResultMap[from] = transactionID;
    }

    function genHashCode(address from) internal pure returns (uint) {
        uint hash = uint(keccak256(abi.encodePacked(from)));
        return hash % (10 ** 15);
    }

    function registerVote(address from, uint16 index) internal returns (uint) {
        uint transactionID = 0;
        if (participants[from] == false) {
            // register vote
            // Generate hidden transaction ID
            transactionID = genHashCode(from);
            voteCounter[index]++;
            participants[from] = true;
            recordedVotes[transactionID] = index;
        }
        return transactionID;
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

        parsePayload(_payload, from, _srcChainId);
        emit ReceiveMsg(_srcChainId, from, _payload);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(uint16 _dstChainId, address _userApplication, bytes calldata _payload, bool _payInZRO, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee) {
        return endpoint.estimateFees(_dstChainId, _userApplication, _payload, _payInZRO, _adapterParams);
    }
}
