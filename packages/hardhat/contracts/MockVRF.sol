// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;


import "contracts/MockVRFConsumerInterface.sol";


contract MockVRF {
    event RandomRequested(uint256 indexed id);


    struct RandomRequest {
        address requester;
        bool isFinished;
    }
    RandomRequest[] public requests;

    address VRFNode = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; //change to vrf node

    function requestRandom() public returns(uint) {
        RandomRequest storage req = requests.push();
        req.requester = msg.sender;
        req.isFinished = false;
        emit RandomRequested(requests.length - 1);
        return requests.length - 1;
        
    } 

    function submitRandom(uint id, uint value) public {
        require(requests[id].isFinished == false, "already finished");
        requests[id].isFinished = true;
        MockVRFConsumerInterface(requests[id].requester).handleRandom(id, value);

    }  
}