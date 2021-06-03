/**
 * @file freelancer.sol
 * @author Jaxcoder <jaxcoder@outlook.com>
 * @date created 17th Apr 2021
 * @date last modified 4th June 2021
 */

//SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.4;

contract freelancer {
    
    enum ScheduleState { planned, funded, started, approved, released }
    enum ProjectState { initiated, accepted, closed }
    
    struct schedule {
        string shortCode;
        string description;
        uint256 value;
        ScheduleState scheduleState;
    }  
  
    int256 public totalSchedules = 0;
    address payable public freelancerAddress;
    address public clientAddress;
    ProjectState public projectState;
    
    mapping(int256 => schedule) public scheduleRegister;
  
	modifier condition(bool _condition) {
		require(_condition);
		_;
	}

	modifier onlyFreelancer() {
		require(msg.sender == freelancerAddress);
		_;
	}

	modifier onlyClient() {
		require(msg.sender == clientAddress);
		_;
	}
	
	modifier bothClientFreelancer() {
		require(msg.sender == clientAddress || msg.sender == freelancerAddress);
		_;	    
	}

	modifier inProjectState(ProjectState _state) {
		require(projectState == _state);
		_;
	}

    modifier inScheduleState(int256 _scheduleId, ScheduleState _state){
        require((_scheduleId <= totalSchedules - 1) && scheduleRegister[_scheduleId].scheduleState == _state);
        _;
    }

    modifier ampleFunding(int256 _scheduleId, uint256 _funding){
        require(scheduleRegister[_scheduleId].value == _funding);
        _;
    }

    modifier noMoreFunds(){
        require(address(this).balance == 0);
        _;
    }

    event scheduleAdded(string shortCode);
    event projectAccepted(address clientAddress);
    event taskFunded(int256 scheduleId);
    event taskStarted(int256 scheduleId);
    event taskApproved(int256 scheduleId);
    event fundsReleased(int256 scheduleId, uint256 valueReleased);
    event projectEnded();
    
    constructor()
    {
        freelancerAddress = payable(msg.sender);
        projectState = ProjectState.initiated;
    }
    
    function addSchedule(string memory _shortCode, string memory _description, uint256 _value)
        public
        inProjectState(ProjectState.initiated)
        onlyFreelancer
    {
        schedule memory s;
        s.shortCode = _shortCode;
        s.description = _description;
        s.scheduleState = ScheduleState.planned;
        s.value = _value;
        scheduleRegister[totalSchedules] = s;
        totalSchedules++;
        emit scheduleAdded(_shortCode);
    }
    
    function acceptProject()
        public
        inProjectState(ProjectState.initiated)
    {
        clientAddress = msg.sender;
        projectState = ProjectState.accepted;
        emit projectAccepted(msg.sender);
    }
    
    function fundTask(int256 _scheduleId)
        public
        payable
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleId, ScheduleState.planned)
        ampleFunding(_scheduleId, msg.value)
        onlyClient
    {
        scheduleRegister[_scheduleId].scheduleState = ScheduleState.funded;
        emit taskFunded(_scheduleId);
    }
    
    function startTask(int256 _scheduleId)
        public
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleId, ScheduleState.funded)
        onlyFreelancer
    {
        scheduleRegister[_scheduleId].scheduleState = ScheduleState.started;
        emit taskStarted(_scheduleId);
    }

    function approveTask(int256 _scheduleId)
        public
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleId, ScheduleState.started)
        onlyClient
    {
        scheduleRegister[_scheduleId].scheduleState = ScheduleState.approved;
        emit taskApproved(_scheduleId);
    }
    
    function releaseFunds(int256 _scheduleId)
        public
        payable
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleId, ScheduleState.approved)
        onlyFreelancer
    {
        freelancerAddress.transfer(scheduleRegister[_scheduleId].value);
        scheduleRegister[_scheduleId].scheduleState = ScheduleState.released;
        emit fundsReleased(_scheduleId, scheduleRegister[_scheduleId].value);
    }
    
    // End the project
    function endProject()
        public
        bothClientFreelancer
        noMoreFunds
    {
        projectState = ProjectState.closed;
        emit projectEnded();
    }
    
    // Get the Freelancer balance
    function getBalance()
        public
        view
        returns (uint256 balance)
    {
        return address(this).balance;
    }
} 