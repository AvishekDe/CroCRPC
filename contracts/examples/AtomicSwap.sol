//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;
import "../interfaces/ILayerZeroEndpoint.sol";
import "../interfaces/ILayerZeroReceiver.sol";
import "hardhat/console.sol";

contract AtomicSwap is ILayerZeroReceiver {
    event ReceiveMsg(uint16 _srcChainId, address _from, bytes _payload);

    ILayerZeroEndpoint public endpoint;

    enum State {
        PUBLISHED,
        REDEEMED,
        REFUNDED
    }
    address public sender;
    address public receiver;
    uint32 public asset;
    State public state;
    bytes public memberpayload;

    //Commitment Schemes - rd, rf

    constructor(address _endpoint, address _receiver) {
        endpoint = ILayerZeroEndpoint(_endpoint);
        receiver = _receiver;
        //asset = msg.value;
        state = State.PUBLISHED;
        // CS rd, rf
    }

    function redeem(uint32 _evidence) external {
        if (state == State.PUBLISHED && isRedeemable(_evidence)) {
            //transfer a to r
            state = State.REDEEMED;
        }
    }

    function refund(uint32 _evidence) external {
        if (state == State.PUBLISHED && isRefundable(_evidence)) {
            //transfer a to s
            state = State.REFUNDED;
        }
    }

    function isRedeemable(uint32 _evidence) public virtual returns (bool verification) {
        //verify rd, evd
        return true;
    }

    function isRefundable(uint32 _evidence) public virtual returns (bool verification) {
        //verify rf, evd
        return true;
    }

    function sendMsg(uint16 _dstChainId, bytes calldata _destination, bytes calldata _src, bytes calldata payload) public payable {
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
        memberpayload = _payload;
        emit ReceiveMsg(_srcChainId, from, _payload);
    }

    // Endpoint.sol estimateFees() returns the fees for the message
    function estimateFees(uint16 _dstChainId, address _userApplication, bytes calldata _payload, bool _payInZRO, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee) {
        return endpoint.estimateFees(_dstChainId, _userApplication, _payload, _payInZRO, _adapterParams);
    }
}
