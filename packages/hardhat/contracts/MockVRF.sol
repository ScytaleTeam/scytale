// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;


import "./MockVRFConsumerInterface.sol";


contract MockVRF {
    event RandomRequested(uint256 indexed id);


    struct RandomRequest {
        address requester;
        uint randomValue;
        bool isFinished;
    }
    RandomRequest[] public requests;

    address VRFNode = 0xF8d72Dd3B52aD43065fDd86332C52d6132179Ca1;

    function requestRandom() public returns(uint) {
        RandomRequest storage req = requests.push();
        req.requester = msg.sender;
        req.isFinished = false;
        emit RandomRequested(requests.length - 1);
        return requests.length - 1;
        
    } 

    function submitRandom(uint id, uint value) public {
        require(requests[id].isFinished == false, "already finished");
        require(msg.sender == VRFNode, "only vrf node");
        requests[id].isFinished = true;
        requests[id].randomValue = value;
        MockVRFConsumerInterface(requests[id].requester).handleRandom(id, value);

    }  
}