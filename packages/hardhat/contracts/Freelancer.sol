/**
 * @file freelancer.sol
 * @author Jaxcoder <jaxcoder@outlook.com>
 * @date created 17th Apr 2021
 * @date last modified 4th June 2021
 */

//SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.4;

/**
 * How to use:
 * 1- Freelancer adds 1 or more schedule items (via addSchedule())
 * 2- Client accepts contract (via acceptProject())
 * 3- Client funds a schedule item (via fundTask())
 * 4- Freelancer starts a schedule item (via startTask())
 * 5- Client approves a finished task (via approveTask())
 * 6- Freelancer gets the eth for the completed schedule item (via releaseFunds())
 * 7- Either the Freelancer or Client end the project (via endProject())
 */

/**
 * TODO: Contract is maybe missing a way for the client to claim eth back if a task is not finished or is removed
 * TODO: Contract is maybe missing some flexibility to add further tasks. As it stands new tasks/schedules can't be added mid project
 * TODO: Possibly, the freelancer should specify the client's adddress on creation, otherwise any 3rd party can accept the contract, forcing the freelancer to have to deploy it again.
 * TODO: Review events for missing params and indexing
*/

contract Freelancer {
    
    enum ScheduleState { Planned, Funded, Started, Approved, Released }
    enum ProjectState { Initiated, Accepted, Closed }
    
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
    
    mapping(int256 => Schedule) public scheduleRegister;
    
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

        modifier ampleFunding(int256 _ScheduleId, uint256 _funding){
            require(scheduleRegister[_ScheduleId].value == _funding);
            _;
        }

        modifier noMoreFunds(){
            require(address(this).balance == 0);
            _;
        }

        event ScheduleAdded(string shortCode);
        event ProjectAccepted(address clientAddress);
        event TaskFunded(int256 ScheduleId);
        event TaskStarted(int256 ScheduleId);
        event TaskApproved(int256 ScheduleId);
        event FundsReleased(int256 ScheduleId, uint256 valueReleased);
        event ProjectEnded();
        
        constructor()
        {
            freelancerAddress = payable(msg.sender);
            projectState = ProjectState.Initiated;
        }

        ///////////////////////
        // Freelancer functions
        ///////////////////////
        
        /// @notice Creates a new schedule
        /// @param _shortCode a short code to identify schedule
        /// @param _description a larger description of the schedule
        /// @param _value how much Eth shouldd be paid by client
        function addSchedule(string memory _shortCode, string memory _description, uint256 _value)
            public
            inProjectState(ProjectState.Initiated)
            onlyFreelancer
        {
            Schedule memory s;
            s.shortCode = _shortCode;
            s.description = _description;
            s.scheduleState = ScheduleState.Planned;
            s.value = _value;
            scheduleRegister[totalSchedules] = s;
            totalSchedules++;
            emit ScheduleAdded(_shortCode);
        }
        
        function startTask(int256 _scheduleId)
            public
            inProjectState(ProjectState.Accepted)
            inScheduleState(_scheduleId, ScheduleState.Funded)
            onlyFreelancer
        {
            scheduleRegister[_scheduleId].scheduleState = ScheduleState.Started;
            emit TaskStarted(_scheduleId);
        }

        function releaseFunds(int256 _scheduleId)
            public
            payable
            inProjectState(ProjectState.Accepted)
            inScheduleState(_scheduleId, ScheduleState.Approved)
            onlyFreelancer
        {
            freelancerAddress.transfer(scheduleRegister[_scheduleId].value);
            scheduleRegister[_scheduleId].scheduleState = ScheduleState.Released;
            emit FundsReleased(_scheduleId, scheduleRegister[_scheduleId].value);
        }        

        ///////////////////////
        // Client functions
        ///////////////////////
        
        function acceptProject() public inProjectState(ProjectState.Initiated)
        {
            clientAddress = msg.sender;
            projectState = ProjectState.Accepted;
            emit ProjectAccepted(msg.sender);
        }
        
        function fundTask(int256 _scheduleId)
            public
            payable
            inProjectState(ProjectState.Accepted)
            inScheduleState(_scheduleId, ScheduleState.Planned)
            ampleFunding(_scheduleId, msg.value)
            onlyClient
        {
            scheduleRegister[_scheduleId].scheduleState = ScheduleState.Funded;
            emit TaskFunded(_scheduleId);
        }

        function approveTask(int256 _scheduleId)
            public
            inProjectState(ProjectState.Accepted)
            inScheduleState(_scheduleId, ScheduleState.Started)
            onlyClient
        {
            scheduleRegister[_scheduleId].scheduleState = ScheduleState.Approved;
            emit TaskApproved(_scheduleId);
        }

        ////////////////////////////////
        // Freelancer / Client functions
        ////////////////////////////////       
        
        // End the project
        function endProject()
            public
            bothClientFreelancer
            noMoreFunds
        {
            projectState = ProjectState.Closed;
            emit ProjectEnded();
        }
        
        // Get the Freelancer balance
        function getBalance() public view returns (uint256 balance)
        {
            return address(this).balance;
        }
} 