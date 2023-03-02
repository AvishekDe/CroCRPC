//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Scratchpad {
    struct Person {
        int a;
        int b;
    }

    function tp() public pure {}

    function test() external view returns (int, int) {
        tp();
        Person memory p = Person(3, 5);
        return (p.a, p.b);
    }
}
