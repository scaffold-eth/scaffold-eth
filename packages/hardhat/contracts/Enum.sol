// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Enum {
  enum Status {
    Pending,
    Shipped,
    Accepted,
    Rejected,
    Cancelled
  }

  // default value is first element in definition of type, "Pending"
  Status public status;

  // Returns uint – 0, 1, 2, 3, 4 based on Status enum value
  function get() public view returns (Status) {
    return status;
  }

  function set(Status _status) public {
    status = _status;
  }

  function cancel() public {
    status = Status.Cancelled;
  }

  // Deleting resets the enum to its first value, 0 "Pending"
  function reset() public {
    delete status;
  }
}
