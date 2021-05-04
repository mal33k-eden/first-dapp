pragma solidity ^0.8.4;

contract TodoList{
    uint public taskCount = 0; 

    struct Task{
        uint id;
        string content;
        bool isCompleted;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );
     event TaskCompleted(
        uint id,
        bool completed
    );
        constructor() public {
        createTask("My first DAPP");
    }
    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }
    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.isCompleted = !_task.isCompleted;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.isCompleted);
    }



}