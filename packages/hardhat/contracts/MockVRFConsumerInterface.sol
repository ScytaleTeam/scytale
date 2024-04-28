// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


interface MockVRFConsumerInterface {
    function handleRandom(uint id, uint random) external;
}