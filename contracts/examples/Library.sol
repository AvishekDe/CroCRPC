//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Library {
    function getSum(int a, int b) external pure returns (int) {
        return a + b;
    }

    function getDiff(int a, int b) external pure returns (int) {
        return a - b;
    }

    function getProduct(int a, int b) external pure returns (int) {
        return a * b;
    }
}
