/**
 * @file freelancer.sol
 * @author Jaxcoder <jaxcoder@outlook.com>
 * @date created 17th Apr 2021
 * @date last modified 4th June 2021
 */

//SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.4;

contract freelancer {
    
    enum ScheduleState {planned, funded, started, approved, released}
    enum ProjectState {initiated, accepted, closed}
    
    struct schedule{
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
	
	modifier bothClientFreelancer(){
		require(msg.sender == clientAddress || msg.sender == freelancerAddress);
		_;	    
	}

	modifier inProjectState(ProjectState _state) {
		require(projectState == _state);
		_;
	}

    modifier inScheduleState(int256 _scheduleID, ScheduleState _state){
        require((_scheduleID <= totalSchedules - 1) && scheduleRegister[_scheduleID].scheduleState == _state);
        _;
    }

    modifier ampleFunding(int256 _scheduleID, uint256 _funding){
        require(scheduleRegister[_scheduleID].value == _funding);
        _;
    }

    modifier noMoreFunds(){
        require(address(this).balance == 0);
        _;
    }

    event scheduleAdded(string shortCode);
    event projectAccepted(address clientAddress);
    event taskFunded(int256 scheduleID);
    event taskStarted(int256 scheduleID);
    event taskApproved(int256 scheduleID);
    event fundsReleased(int256 scheduleID, uint256 valueReleased);
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
    
    function fundTask(int256 _scheduleID)
        public
        payable
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleID, ScheduleState.planned)
        ampleFunding(_scheduleID, msg.value)
        onlyClient
    {
        scheduleRegister[_scheduleID].scheduleState = ScheduleState.funded;
        emit taskFunded(_scheduleID);
    }
    
    function startTask(int256 _scheduleID)
        public
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleID, ScheduleState.funded)
        onlyFreelancer
    {
        scheduleRegister[_scheduleID].scheduleState = ScheduleState.started;
        emit taskStarted(_scheduleID);
    }

    function approveTask(int256 _scheduleID)
        public
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleID, ScheduleState.started)
        onlyClient
    {
        scheduleRegister[_scheduleID].scheduleState = ScheduleState.approved;
        emit taskApproved(_scheduleID);
    }
    
    function releaseFunds(int256 _scheduleID)
        public
        payable
        inProjectState(ProjectState.accepted)
        inScheduleState(_scheduleID, ScheduleState.approved)
        onlyFreelancer
    {
        freelancerAddress.transfer(scheduleRegister[_scheduleID].value);
        scheduleRegister[_scheduleID].scheduleState = ScheduleState.released;
        emit fundsReleased(_scheduleID, scheduleRegister[_scheduleID].value);
    }
    
    function endProject()
        public
        bothClientFreelancer
        noMoreFunds
    {
        projectState = ProjectState.closed;
        emit projectEnded();
    }
    
    function getBalance()
        public
        view
        returns (uint256 balance)
    {
        return address(this).balance;
    }
} 