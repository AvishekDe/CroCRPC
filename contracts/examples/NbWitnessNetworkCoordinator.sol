// SPDX-License-Identifier: MIT

//
// Note: you will need to fund each deployed contract with gas
//
// PingPong sends a LayerZero message back and forth between chains
// until it is paused or runs out of gas!
//
// Demonstrates:
//  1. a recursive feature of calling send() from inside lzReceive()
//  2. how to `estimateFees` for a send()'ing a LayerZero message
//  3. the contract pays the message fee

pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/security/Pausable.sol";
import "../lzApp/NonblockingLzApp.sol";

contract NbWitnessNetworkCoordinator is NonblockingLzApp, Pausable {
    // event emitted every ping() to keep track of consecutive pings count
    event Ping(uint pings);

    enum State {
        PUBLISHED,
        REDEEM_AUTHORIZED,
        REFUND_AUTHORIZED
    }
    address[] public pk;
    bytes32 public multisign;
    State public state;
    address[] public headers;
    string public receivedMsg;

    constructor(address _endpoint, address[] memory _pk, bytes32 _multisign, address[] memory _headers) NonblockingLzApp(_endpoint) {
        pk = _pk;
        multisign = _multisign;
        state = State.PUBLISHED;
        headers = _headers;
    }

    // constructor requires the LayerZero endpoint for this chain
    //constructor(address _endpoint) NonblockingLzApp(_endpoint) {}

    // disable ping-ponging
    function enable(bool en) external {
        if (en) {
            _pause();
        } else {
            _unpause();
        }
    }

    // pings the destination chain, along with the current number of pings sent
    function ping(
        uint16 _dstChainId, // send a ping to this destination chainId
        address, // destination address of PingPong contract
        uint pings // the number of pings
    ) public payable whenNotPaused {
        require(address(this).balance > 0, "the balance of this contract is 0. pls send gas for message fees");

        emit Ping(++pings);

        // encode the payload with the number of pings
        bytes memory payload = abi.encode(pings);

        // use adapterParams v1 to specify more gas for the destination
        uint16 version = 1;
        uint gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(version, gasForDestinationLzReceive);

        // send LayerZero message
        _lzSend( // {value: messageFee} will be paid out of this contract!
            _dstChainId, // destination chainId
            payload, // abi.encode()'ed bytes
            payable(this), // (msg.sender will be this contract) refund address (LayerZero will refund any extra gas back to caller of send()
            address(0x0), // future param, unused for this example
            adapterParams, // v1 adapterParams, specify custom destination gas qty
            msg.value
        );
    }

    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory _srcAddress, uint64 /*_nonce*/, bytes memory _payload) internal override {
        // use assembly to extract the address from the bytes memory parameter
        address sendBackToAddress;
        assembly {
            sendBackToAddress := mload(add(_srcAddress, 20))
        }

        receivedMsg = string(_payload);
        string memory statecheck = "statecheck";
        if (keccak256(abi.encodePacked(statecheck)) == keccak256(abi.encodePacked(string(abi.encodePacked(_payload))))) {
            receivedMsg = "insideIf";
            //sendMsg(_srcChainId, abi.encodePacked(from), abi.encodePacked(address(this)), _payload);
            receivedMsg = "sent";
        }

        // *pong* back to the other side
        //ping(_srcChainId, sendBackToAddress, pings);
    }

    // allow this contract to receive ether
    receive() external payable {}
}
