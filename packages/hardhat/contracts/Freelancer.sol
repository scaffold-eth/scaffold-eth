/**
 * @file freelancer.sol
 * @author Jaxcoder <jaxcoder@outlook.com>
 * @date created 17th Apr 2021
 * @date last modified 4th June 2021
 */

//SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.4;

contract Freelancer {
    
    enum ScheduleState { planned, funded, started, approved, released }
    enum ProjectState { initiated, accepted, closed }
    
    struct Schedule {
        string shortCode;
        string description;
        uint256 value;
        ScheduleState scheduleState;
    }  
  
    int256 public totalSchedules = 0;
    address payable public freelancerAddress;
    address public clientAddress;
    ProjectState public projectState;
    
    mapping(int256 => Schedule) public ScheduleRegister;
  
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

    modifier inScheduleState(int256 _ScheduleId, ScheduleState _state){
        require((_ScheduleId <= totalSchedules - 1) && ScheduleRegister[_ScheduleId].scheduleState == _state);
        _;
    }

    modifier ampleFunding(int256 _ScheduleId, uint256 _funding){
        require(ScheduleRegister[_ScheduleId].value == _funding);
        _;
    }

    modifier noMoreFunds(){
        require(address(this).balance == 0);
        _;
    }

    event ScheduleAdded(string shortCode);
    event projectAccepted(address clientAddress);
    event taskFunded(int256 ScheduleId);
    event taskStarted(int256 ScheduleId);
    event taskApproved(int256 ScheduleId);
    event fundsReleased(int256 ScheduleId, uint256 valueReleased);
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
        Schedule memory s;
        s.shortCode = _shortCode;
        s.description = _description;
        s.scheduleState = ScheduleState.planned;
        s.value = _value;
        ScheduleRegister[totalSchedules] = s;
        totalSchedules++;
        emit ScheduleAdded(_shortCode);
    }
    
    function acceptProject()
        public
        inProjectState(ProjectState.initiated)
    {
        clientAddress = msg.sender;
        projectState = ProjectState.accepted;
        emit projectAccepted(msg.sender);
    }
    
    function fundTask(int256 _ScheduleId)
        public
        payable
        inProjectState(ProjectState.accepted)
        inScheduleState(_ScheduleId, ScheduleState.planned)
        ampleFunding(_ScheduleId, msg.value)
        onlyClient
    {
        ScheduleRegister[_ScheduleId].scheduleState = ScheduleState.funded;
        emit taskFunded(_ScheduleId);
    }
    
    function startTask(int256 _ScheduleId)
        public
        inProjectState(ProjectState.accepted)
        inScheduleState(_ScheduleId, ScheduleState.funded)
        onlyFreelancer
    {
        ScheduleRegister[_ScheduleId].scheduleState = ScheduleState.started;
        emit taskStarted(_ScheduleId);
    }

    function approveTask(int256 _ScheduleId)
        public
        inProjectState(ProjectState.accepted)
        inScheduleState(_ScheduleId, ScheduleState.started)
        onlyClient
    {
        ScheduleRegister[_ScheduleId].scheduleState = ScheduleState.approved;
        emit taskApproved(_ScheduleId);
    }
    
    function releaseFunds(int256 _ScheduleId)
        public
        payable
        inProjectState(ProjectState.accepted)
        inScheduleState(_ScheduleId, ScheduleState.approved)
        onlyFreelancer
    {
        freelancerAddress.transfer(ScheduleRegister[_ScheduleId].value);
        ScheduleRegister[_ScheduleId].scheduleState = ScheduleState.released;
        emit fundsReleased(_ScheduleId, ScheduleRegister[_ScheduleId].value);
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