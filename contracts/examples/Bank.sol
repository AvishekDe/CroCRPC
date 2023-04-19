//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";
import "../../Seriality/src/Seriality.sol";

contract Bank is ILayerZeroReceiver, Seriality {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);
    event ParsedMsg(int amount, string fn);
    event ExternalCall(int op1, int op2, int ans);

    // Dependencies
    ILayerZeroEndpoint public endpoint;
    int public ret;
    string public rec;

    // Needed by the daemon to send back results
    mapping(address => int) public pendingResultMap;
    address[] public pendingAddresses;

    // App specific data members
    mapping(address => int) public customer_balances;
    mapping(address => uint16) public chainIDmap;

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

    function countPending() public view returns (uint) {
        return pendingAddresses.length;
    }

    function deleteFirstResult() external {
        //delete
        uint pendingResults = countPending();
        address a = pendingAddresses[0];
        for (uint i = 0; i < pendingResults - 1; i++) {
            pendingAddresses[i] = pendingAddresses[i + 1];
        }

        delete pendingResultMap[a];
        pendingAddresses.pop();
    }

    function getFirstResult() external view returns (address, uint16, int) {
        uint pendingResults = countPending();
        require(pendingResults > 0);
        address a = pendingAddresses[0];
        uint16 cid = chainIDmap[a];
        int ans = pendingResultMap[a];
        return (a, cid, ans);
    }

    function parsePayload(bytes memory _payload, address from, uint16 _srcChainID) public {
        chainIDmap[from] = _srcChainID;

        uint offset = 200;
        string memory temp = new string(32);
        string memory fn = new string(32);

        int amount;
        address receiver;

        bytesToString(offset, _payload, bytes(fn));
        offset -= sizeOfString(temp);

        amount = bytesToInt256(offset, _payload);
        offset -= sizeOfInt(256);

        if (keccak256(abi.encodePacked(fn)) == keccak256(abi.encodePacked("send"))) {
            receiver = bytesToAddress(offset, _payload);
            offset -= sizeOfAddress();
        }

        emit ParsedMsg(amount, fn);
        int balance = 0;

        if (keccak256(abi.encodePacked(fn)) == keccak256(abi.encodePacked("send"))) {
            balance = processTransfer(from, receiver, amount);
        } else {
            // deposit
            balance = processDeposit(from, amount);
        }

        pendingAddresses.push(from);
        pendingResultMap[from] = balance;
    }

    function processTransfer(address from, address to, int amount) internal returns (int) {
        int sender_balance = customer_balances[from];
        if (amount > 0 && amount <= sender_balance) {
            customer_balances[from] = sender_balance - amount;
            int receiver_balance = customer_balances[to];
            customer_balances[to] = receiver_balance + amount;

            pendingAddresses.push(to);
            pendingResultMap[to] = customer_balances[to];
        }
        return customer_balances[from];
    }

    function processDeposit(address from, int amount) internal returns (int) {
        int current_balance = customer_balances[from];
        customer_balances[from] = current_balance + amount;
        return customer_balances[from];
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
