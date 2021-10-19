// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Function {
  // Functions can return multiple values
  function returnMany()
    public
    pure
    returns (
      uint,
      bool,
      uint
    ) 
  {
    return (1, true, 1);
  }

  // Return values can be named
  function named()
    public
    pure
    returns (
      uint x,
      bool b,
      uint y
    )
  {
    return (1, true, 2);
  }

  // Return values can be assigned to their name (in this case the return statement can be omitted)
  function assigned()
    public
    pure
    returns (
      uint x,
      bool b,
      uint y
    )
  {
    x = 1;
    b = true;
    y = 2;
  }

  // Use destructing assignment when calling another function that returns multiple values
  function destructingAssignments()
    public
    pure
    returns (
      uint,
      bool,
      uint,
      uint,
      uint
    )
  {
    (uint i, bool b, uint j) = returnMany();

    // Values can be left out
    (uint x, , uint y) = (4, 5, 6);

    return (i, b, j, x, y);
  }

  // Cannot use map for either input or output of a public function

  // Can use array for input of a public function
  function arrayInput(uint[] memory _arr) public {}

  // And output
  uint[] public arr;

  function arrayOutput() public view returns (uint[] memory) {
    return arr;
  }
}
