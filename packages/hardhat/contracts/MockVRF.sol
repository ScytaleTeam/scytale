// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;


import "contracts/MockVRFConsumerInterface.sol";


contract MockVRF {
    event RandomRequested(uint256 indexed id);


    struct RandomRequest {
        address requester;
        bool isFinished;
    }
    RandomRequest[] public requests;

    address VRFNode = 0xF8d72Dd3B52aD43065fDd86332C52d6132179Ca1; //change to vrf node

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