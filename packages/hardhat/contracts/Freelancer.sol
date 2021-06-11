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
 * TODO: Requires major refctoring but it would be leaner on gas spending to have a single contract that keeps tracks of projects and their schedules instead of having to deploy one contract per project.
 * TODO: Add revert error information and/or console.logs for easier debugging
 * TODO: Currently, the project can be ended even if not all tasks are complete (as long as there 0 balance in the contract), not sure if that's by design or not.
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

    uint256 public totalSchedules = 0;
    address payable public freelancerAddress;
    address public clientAddress;
    ProjectState public projectState;
    uint256 public totalFundsReceived;
    uint256 public totalFundsDisbursed;


    
    mapping(uint256 => Schedule) public scheduleRegister;
    
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

        modifier inScheduleState(uint256 _scheduleId, ScheduleState _state){
            require((_scheduleId <= totalSchedules - 1) && scheduleRegister[_scheduleId].scheduleState == _state);
            _;
        }

        modifier ampleFunding(uint256 _ScheduleId, uint256 _funding){
            require(scheduleRegister[_ScheduleId].value == _funding);
            _;
        }

        modifier noMoreFunds(){
            require(address(this).balance == 0);
            _;
        }

        event ScheduleAdded(string shortCode);
        event ProjectAccepted(address clientAddress);
        event TaskFunded(uint256 scheduleId);
        event TaskStarted(uint256 scheduleId);
        event TaskApproved(uint256 scheduleId);
        event FundsReleased(uint256 scheduleId, uint256 valueReleased);
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
            external
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
        
        function startTask(uint256 _scheduleId)
            external
            inProjectState(ProjectState.Accepted)
            inScheduleState(_scheduleId, ScheduleState.Funded)
            onlyFreelancer
        {
            scheduleRegister[_scheduleId].scheduleState = ScheduleState.Started;
            emit TaskStarted(_scheduleId);
        }

        function releaseFunds(uint256 _scheduleId)
            external
            payable
            inProjectState(ProjectState.Accepted)
            inScheduleState(_scheduleId, ScheduleState.Approved)
            onlyFreelancer
        {
            totalFundsDisbursed += scheduleRegister[_scheduleId].value;
            freelancerAddress.transfer(scheduleRegister[_scheduleId].value);
            scheduleRegister[_scheduleId].scheduleState = ScheduleState.Released;
            emit FundsReleased(_scheduleId, scheduleRegister[_scheduleId].value);
        }        

        ///////////////////////
        // Client functions
        ///////////////////////
        
        function acceptProject() external inProjectState(ProjectState.Initiated)
        {
            require(totalSchedules > 0, "ERROR: Project must have at least 1 task");
            clientAddress = msg.sender;
            projectState = ProjectState.Accepted;
            emit ProjectAccepted(msg.sender);
        }
        
        function fundTask(uint256 _scheduleId)
            external
            payable
            inProjectState(ProjectState.Accepted)
            inScheduleState(_scheduleId, ScheduleState.Planned)
            ampleFunding(_scheduleId, msg.value)
            onlyClient
        {
            totalFundsReceived += msg.value;
            scheduleRegister[_scheduleId].scheduleState = ScheduleState.Funded;
            emit TaskFunded(_scheduleId);
        }

        function approveTask(uint256 _scheduleId)
            external
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
            external
            inProjectState(ProjectState.Accepted)
            bothClientFreelancer
            noMoreFunds
        {
            projectState = ProjectState.Closed;
            emit ProjectEnded();
        }
        
        // Get the Freelancer balance
        function getBalance() public view returns (uint256 balance)
        {
            return totalFundsReceived - totalFundsDisbursed;
        }
} 