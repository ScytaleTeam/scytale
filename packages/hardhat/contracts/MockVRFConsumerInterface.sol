// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;


interface MockVRFConsumerInterface {
    function handleRandom(uint id, uint random) external;
}