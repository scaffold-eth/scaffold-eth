// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract TodoStruct {
  struct Todo {
    string text;
    bool completed;
  }

  Todo[] public todos;

  function create(string memory _text) public {
    // 3 ways to initialize a struct

    // call it like a function
    todos.push(Todo(_text, false));

    // map key to value
    todos.push(Todo({text: _text, completed: false}));

    // initialize an empty struct and update it
    Todo memory todo;
    todo.text = _text;

    todos.push(todo);
  }

  function get(uint _index) public view returns (string memory text, bool completed) {
    Todo storage todo = todos[_index];
    return (todo.text, todo.completed);
  }

  function update(uint _index, string memory _text) public {
    Todo storage todo = todos[_index];
    todo.text = _text;
  }

  function complete(uint _index) public {
    Todo storage todo = todos[_index];
    todo.completed = !todo.completed;
  }
}
