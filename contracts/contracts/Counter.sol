// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Counter
 * @notice A simple counter contract that tracks a single uint256 value
 * @dev Implements increment, decrement, and read operations with underflow protection
 */
contract Counter {
    uint256 private _count;

    /**
     * @notice Emitted when the counter is incremented
     * @param newCount The new counter value after incrementing
     */
    event CounterIncremented(uint256 newCount);

    /**
     * @notice Emitted when the counter is decremented
     * @param newCount The new counter value after decrementing
     */
    event CounterDecremented(uint256 newCount);

    /**
     * @notice Increments the counter by 1
     * @dev Increases _count by 1 and emits CounterIncremented event
     */
    function increment() public {
        _count += 1;
        emit CounterIncremented(_count);
    }

    /**
     * @notice Decrements the counter by 1
     * @dev Decreases _count by 1 and emits CounterDecremented event
     * @dev Reverts if counter is already at 0 to prevent underflow
     */
    function decrement() public {
        require(_count > 0, "Counter: underflow");
        _count -= 1;
        emit CounterDecremented(_count);
    }

    /**
     * @notice Returns the current counter value
     * @return The current value of the counter
     */
    function getCount() public view returns (uint256) {
        return _count;
    }
}
