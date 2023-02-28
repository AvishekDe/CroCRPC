//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Scratchpad {
    event Trans(int a, int b, int ans);

    function someAction(address addr) public payable returns (int) {
        ExLibrary c = ExLibrary(addr);
        int ans = c.getSum(5, 4);
        emit Trans(5, 4, ans);
        return ans;
    }
}

abstract contract ExLibrary {
    function getSum(int a, int b) external pure virtual returns (int);

    function getDiff(int a, int b) external pure virtual returns (int);

    function getProduct(int a, int b) external pure virtual returns (int);
}
