import Web3 from "web3";
import freelancerArtifact from "../../build/contracts/freelancer.json";
import 'bootstrap';
import { Modal, Popover } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const App = {

  //web3 declarations
  web3: null,
  account: null,
  meta: null,
  freelancerContract:null,              //actual freelance contract object
  freelanceContractAddress:null,        //address of the freelance contract
  popoverTriggerList:null,
  popoverList: null,
  freelancerContractStatus: null,

  //ui declarations
  uiSpnLoad:null,
  uiSpnAddSchedule: null,
  uiConContract:null,
  uiSpnContractAction: null,
  uiLblContractAddress:null,
  uiLblFreelancerAddress:null,
  uiTxtContractAddress:null,
  uiLblClientAddress: null,
  uiLblProjectState:null,
  scheduleModal: null,
  uiTxtShortCode: null,
  uiTxtScheduleDescription: null,
  uiTxtScheduleValue: null,
  uiTblScheduleTable: null,
  uiTblScheduleTableBody: null,
  uiBtnDeploy: null,
  uiBtnDeployPopover: null,
  uiLblTotalEth: null,
  uiLblDisbursedEth: null,
  uiBtnAcceptProject: null,
  uiBtnAddSchedule: null,
  uiBtnEndProject: null,

  start: async function() {
    const { web3 } = this;
    //get accounts
    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];

    this.uiBtnDeploy = document.getElementById("btn-Deploy");
    //this.uiBtnDeploy.classList.add("disabled");
    
    this.uiBtnDeployPopover = new Popover(this.uiBtnDeploy);
  },

  btnGo: function(){
    this.uiBtnDeployPopover.hide();

    this.uiTxtContractAddress = document.getElementById("txt-contract-address").value;
    if (this.uiTxtContractAddress === ""){
      this.deployFreelancer();
    }
    else {
        this.retrieveFreelancer(this.uiTxtContractAddress);  
    }
  },

  //
  utilToggerAllButtonOnOff: function(state){
    if (state == 0){
      let buttons = document.getElementsByTagName("button");
      let i;
      for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("disabled");
        console.log(buttons[i]);
      }
    }
    else if (state == 1){
      let buttons = document.getElementsByTagName("button");
      let i;
      for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("disabled");
        console.log(buttons[i]);
      }
    }
  },

  btnGoClient: function(){
    const { web3 } = this;
    this.uiBtnDeployPopover.hide();
    this.uiTxtContractAddress = document.getElementById("txt-contract-address").value;
    if (this.uiTxtContractAddress === ""){
      this.uiBtnDeployPopover.show();
    }
    else{
      this.freelanceContractAddress = this.uiTxtContractAddress;
      this.freelancerContract = new web3.eth.Contract(freelancerArtifact.abi, this.freelanceContractAddress);
      this.retrieveFreelancer(this.uiTxtContractAddress, "client");
    }
  },

  btnAcceptProject: async function(){
    this.uiSpnContractAction = document.getElementById("spn-contract-action");
    this.uiSpnContractAction.classList.remove('d-none');
    this.utilToggerAllButtonOnOff(0);
    this.freelancerContract.methods.acceptProject().send({from: this.account})
    .on('error', function(error, receipt) { 
      App.uiSpnContractAction.classList.add('d-none');
      App.utilToggerAllButtonOnOff(1);
    })
    .then((result) => {
      this.utilRefreshHeader(this.freelanceContractAddress);
      this.utilRefreshScheduleTableClient();
      this.uiSpnContractAction.classList.add('d-none');
      this.utilToggerAllButtonOnOff(1);
    });

  },

  btnEndProject: async function(){
    this.uiSpnContractAction  = document.getElementById("spn-contract-action");
    this.uiSpnContractAction.classList.remove('d-none');
    this.utilToggerAllButtonOnOff(0);
    this.freelancerContract.methods.endProject().send({from: this.account})
    .on('error', function(error, receipt) { 
      App.uiSpnContractAction.classList.add('d-none');
      App.utilToggerAllButtonOnOff(1);
    })
    .then((result) => {
      this.utilRefreshHeader(this.freelanceContractAddress);
      this.utilRefreshScheduleTable();
      this.uiSpnContractAction.classList.add('d-none');
      this.utilToggerAllButtonOnOff(1);
    });
  },

  btnAddSchedule: async function(){
    if (document.getElementById("Schedule-Form").checkValidity()){
      this.uiTxtShortCode = document.getElementById("txt-short-code").value;
      this.uiTxtScheduleDescription = document.getElementById("txt-schedule-description").value;
      this.uiTxtScheduleValue = document.getElementById("txt-schedule-value").value;
      this.uiSpnAddSchedule = document.getElementById("spn-add-schedule");
      this.uiSpnAddSchedule.classList.remove('d-none');
      this.utilToggerAllButtonOnOff(0);
      
      this.freelancerContract.methods.addSchedule(this.uiTxtShortCode, this.uiTxtScheduleDescription, App.web3.utils.toWei(this.uiTxtScheduleValue, 'ether')).send({from: this.account})
      .on('error', function(error, receipt) { 
        console.log(App.uiSpnAddSchedule);
        App.uiSpnAddSchedule.classList.add('d-none');
        App.scheduleModal = Modal.getInstance(document.getElementById('scheduleModal'));
        App.scheduleModal.hide();
        App.utilToggerAllButtonOnOff(1);
      })
      .then((result) =>{
        console.log("try to do this");
        this.uiTblScheduleTable = document.getElementById("tbl-schedule-table");
        this.uiTblScheduleTable.classList.remove('d-none');  
        this.uiSpnAddSchedule.classList.add('d-none');
        this.scheduleModal = Modal.getInstance(document.getElementById('scheduleModal'));
        this.utilAddScheduleToTable(this.uiTxtShortCode, this.uiTxtScheduleDescription, App.web3.utils.toWei(this.uiTxtScheduleValue, 'ether'), 0);
        this.utilGetEthValue();
        this.scheduleModal.hide();
        this.utilToggerAllButtonOnOff(1);
      });

    }
    else{
      console.log("nope");
    }
  },

  btnRefresh:async  function(who){
    console.log("---" + this.freelanceContractAddress);
    if (this.freelanceContractAddress == null)
      this.freelanceContractAddress = document.getElementById("txt-contract-address").value;

    await this.utilRefreshHeader(this.freelanceContractAddress);
    
    if (who == "freelancer"){
      await this.utilRefreshScheduleTable();
    }
    else {
      await this.utilRefreshScheduleTableClient();
    }
  },

  btnFundSchedule: async function(value, scheduleID){
    let scheduleAction = document.getElementById("spn-schedule-action-"+scheduleID);
    scheduleAction.classList.remove('d-none');
    this.utilToggerAllButtonOnOff(0);
    await this.freelancerContract.methods.fundTask(scheduleID).send({from: this.account, "value": App.web3.utils.toWei(value.toString(), 'ether')})
    .on('error', function(error, receipt) { 
      console.log("cancelled funding");
      scheduleAction.classList.add('d-none');
      App.utilToggerAllButtonOnOff(1);
    })
    .then((result) => {
      this.btnRefresh("client"); //reconsider
      scheduleAction.classList.add('d-none');
      this.utilToggerAllButtonOnOff(1);
    });
  },

  btnStartSchedule: async function(scheduleID){
    let scheduleAction = document.getElementById("spn-schedule-action-"+scheduleID);
    scheduleAction.classList.remove('d-none');
    this.utilToggerAllButtonOnOff(0);
    await this.freelancerContract.methods.startTask(scheduleID).send({from: this.account})
    .on('error', function(error, receipt) { 
      scheduleAction.classList.add('d-none');
      App.utilToggerAllButtonOnOff(1);
    })
    .then((result) => {
      this.btnRefresh("freelancer"); //reconsider
      scheduleAction.classList.add('d-none');
      this.utilToggerAllButtonOnOff(1);
    });
  },

  btnApproveSchedule: async function(scheduleID){
    let scheduleAction = document.getElementById("spn-schedule-action-"+scheduleID);
    scheduleAction.classList.remove('d-none');
    this.utilToggerAllButtonOnOff(0);
    await this.freelancerContract.methods.approveTask(scheduleID).send({from: this.account})
    .on('error', function(error, receipt) { 
      scheduleAction.classList.add('d-none');
      App.utilToggerAllButtonOnOff(1);
    })
    .then((result) => {
      this.btnRefresh("client"); //reconsider
      scheduleAction.classList.add('d-none');
      this.utilToggerAllButtonOnOff(1);
    });
  },
  
  btnReleaseFunds: async function(scheduleID){
    let scheduleAction = document.getElementById("spn-schedule-action-"+scheduleID);
    scheduleAction.classList.remove('d-none');
    this.utilToggerAllButtonOnOff(0);
    await this.freelancerContract.methods.releaseFunds(scheduleID).send({from: this.account})
    .on('error', function(error, receipt) { 
      scheduleAction.classList.add('d-none');
      App.utilToggerAllButtonOnOff(1);
    })
    .then((result) => {
      this.btnRefresh("freelancer"); //reconsider
      scheduleAction.classList.add('d-none');
    });
    this.utilToggerAllButtonOnOff(1);
  },

  utilToggerActionBtns: async function(who){
    if (who == "freelancer"){
      this.uiBtnAddSchedule = document.getElementById("btn-Add-Schedule");
      this.uiBtnEndProject = document.getElementById("btn-End-Project");
  
      await this.freelancerContract.methods.projectState().call().then((result) =>{
        if (result == 0){
          this.uiBtnAddSchedule.disabled = false;
          this.uiBtnEndProject.disabled = true;
        }
        else if (result == 1){
          this.uiLblTotalEth = document.getElementById("lbl-total-eth");
          this.uiLblDisbursedEth = document.getElementById("lbl-disbursed-eth");
          console.log("T:" + this.uiLblTotalEth.innerHTML);
          console.log("D:"+ this.uiLblDisbursedEth.innerHTML);
          if (this.uiLblTotalEth.innerHTML == this.uiLblDisbursedEth.innerHTML){
            this.uiBtnAddSchedule.disabled = true;
            this.uiBtnEndProject.disabled = false;
          }
          else{
            this.uiBtnAddSchedule.disabled = true;
            this.uiBtnEndProject.disabled = true;
          }
        }
        else if (result == 2){
          this.uiBtnAddSchedule.disabled = true;
          this.uiBtnEndProject.disabled = true;
        }
      });
    }
    else {
      this.uiBtnAcceptProject = document.getElementById("btn-Accept-Project");
      console.log("btn-----"+this.uiBtnAcceptProject);
      await this.freelancerContract.methods.projectState().call().then((result) =>{
        if (result == 0){
          this.uiBtnAcceptProject.disabled = false;
        }
        else if (result == 1){
          this.uiBtnAcceptProject.disabled = true;  
        }
        else if (result == 2){
          this.uiBtnAcceptProject.disabled = true;  
        }
      });
    }
  },

  utilScheduleState: function(stateCode){
    //planned, funded, started, approved, released
    switch(stateCode){
      case 0:
        return "<span class='badge bg-primary'>Planned</span>";
      case 1:
        return "<span class='badge bg-success'>Funded</span>";
      case 2:
        return "<span class='badge bg-warning'>Started</span>";
      case 3:
        return "<span class='badge bg-info'>Approved</span>";
      case 4:       
        return "<span class='badge bg-dark'>Released</span>";
    }
  },

  utilProjectStatus: function(statusCode){
    //initiated, accepted, closed
    console.log(statusCode);
    this.uiLblProjectState = document.getElementById("lbl-project-status");
    switch(statusCode){
      case 0:
        this.uiLblProjectState.classList.add('bg-primary');
        this.uiLblProjectState.textContent = "Initiated";
        break;
      case 1:
        this.uiLblProjectState.classList.add('bg-success');
        this.uiLblProjectState.textContent = "Accepted";
        break;
      case 2:
        this.uiLblProjectState.classList.add('bg-warning');
        this.uiLblProjectState.textContent = "Closed";
        break;
    }
  },

  utilGetEthValue: async function(){
    this.uiLblTotalEth = document.getElementById("lbl-total-eth");
    this.uiLblDisbursedEth = document.getElementById("lbl-disbursed-eth");

    let totalRow;
    let totalDisbursed=0;
    let totalValue = 0;

    await this.freelancerContract.methods.totalSchedules().call().then((result) => {
      totalRow = result;
    });

    for (let i=0; i<= totalRow-1; i++){
      await this.freelancerContract.methods.scheduleRegister(i).call().then((result)=>{
        totalValue += result["value"]/1000000000000000000;
        if (result["scheduleState"] == 4){
          totalDisbursed += result["value"]/1000000000000000000;
        }
      });
    }

    this.uiLblTotalEth.innerHTML = Math.round(totalValue*100)/100;
    this.uiLblDisbursedEth.innerHTML = Math.round(totalDisbursed*100)/100;
  },

  utilAddScheduleToTable: function(shortcode, description, value, state, action="freelancer", scheduleID = 0){
    let tr;
    let td; 

    this.uiTblScheduleTableBody = document.getElementById("schedule-table-body");    
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.innerHTML = shortcode;
    tr.appendChild(td);
    this.uiTblScheduleTableBody.appendChild(tr);

    td = document.createElement("td");
    td.innerHTML = description;
    tr.classList.add("table-active");
    tr.appendChild(td);
    this.uiTblScheduleTableBody.appendChild(tr);

    td = document.createElement("td");
    td.innerHTML = value/1000000000000000000;
    td.classList.add('text-end');
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = this.utilScheduleState(parseInt(state));
    tr.appendChild(td);

    td = document.createElement("td");
    //let client fund this if (a) it's the client (b) schedule is not funded (c) project is accepted
    if (action === "client" && state == 0 && this.freelancerContractStatus == 1){
      td.innerHTML = '<button type="button" onclick="App.btnFundSchedule('+ value/1000000000000000000 + ',' + scheduleID + ')" class="btn btn-primary btn-sm">Fund</button>';
      td.innerHTML += '<span class="spinner-border spinner-border-sm d-none" role="status" id="spn-schedule-action-'+ scheduleID + '"></span>';
    }
    else if (action === "freelancer" && state == 1 && this.freelancerContractStatus == 1){
      td.innerHTML = '<button type="button" onclick="App.btnStartSchedule(' + scheduleID + ')" class="btn btn-success btn-sm">Start Work</button>';
      td.innerHTML += '<span class="spinner-border spinner-border-sm d-none" role="status" id="spn-schedule-action-'+ scheduleID + '"></span>';
    }
    else if (action === "client" && state == 2 && this.freelancerContractStatus == 1){
      td.innerHTML = '<button type="button" onclick="App.btnApproveSchedule(' + scheduleID + ')" class="btn btn-warning btn-sm">Approve</button>';
      td.innerHTML += '<span class="spinner-border spinner-border-sm d-none" role="status" id="spn-schedule-action-'+ scheduleID + '"></span>';
    }
    else if (action === "freelancer" && state == 3 && this.freelancerContractStatus == 1){
      td.innerHTML = '<button type="button" onclick="App.btnReleaseFunds(' + scheduleID + ')" class="btn btn-info btn-sm">Release Funds</button>';
      td.innerHTML += '<span class="spinner-border spinner-border-sm d-none" role="status" id="spn-schedule-action-'+ scheduleID + '"></span>';
    }

    tr.appendChild(td);

    this.uiTblScheduleTableBody.appendChild(tr);
  },

  utilRefreshScheduleTable: async function(){
    console.log("freelancer table refresh");
    this.uiTblScheduleTable = document.getElementById("tbl-schedule-table"); 
    this.uiTblScheduleTable.classList.remove('d-none');  

    while (this.uiTblScheduleTable.rows[1]){
      this.uiTblScheduleTable.deleteRow(1);
    }

    let totalRow;

    await this.freelancerContract.methods.totalSchedules().call().then((result) => {
      totalRow = result;
    });

    for (let i=0; i<= totalRow-1; i++){
      await this.freelancerContract.methods.scheduleRegister(i).call().then((result)=>{
        this.utilAddScheduleToTable(result["shortCode"], result["description"], result["value"], result["scheduleState"], "freelancer", i);
      });
    }

    //update the ETH Value boxes
    await this.utilGetEthValue();
    this.utilToggerActionBtns("freelancer");
  },

  utilRefreshScheduleTableClient: async function(){
    console.log("Client table refresh");
    this.utilToggerActionBtns("client");
    this.uiTblScheduleTable = document.getElementById("tbl-schedule-table"); 
    this.uiTblScheduleTable.classList.remove('d-none');  

    while (this.uiTblScheduleTable.rows[1]){
      this.uiTblScheduleTable.deleteRow(1);
    }

    let totalRow;

    await this.freelancerContract.methods.totalSchedules().call().then((result) => {
      totalRow = result;
    });

    for (let i=0; i<= totalRow-1; i++){
      await this.freelancerContract.methods.scheduleRegister(i).call().then((result)=>{
        this.utilAddScheduleToTable(result["shortCode"], result["description"], result["value"], result["scheduleState"], "client", i);
      });
    }

    await this.utilGetEthValue();
    this.utilToggerActionBtns("client");
  },

  utilRefreshHeader: async function(ContractAddress){
    const { web3 } = this;
    this.freelancerContract = new web3.eth.Contract(freelancerArtifact.abi, ContractAddress);
    this.uiConContract = document.getElementById("con-contract");
    this.uiLblContractAddress = document.getElementById("lbl-contract-address");
    this.uiLblFreelancerAddress = document.getElementById("lbl-freelancer-address");
    this.uiLblClientAddress = document.getElementById("lbl-client-address");

    this.uiConContract.classList.remove('d-none');

      this.uiLblContractAddress.textContent = ContractAddress;

      await this.freelancerContract.methods.freelancerAddress().call().then((result) =>{
        this.uiLblFreelancerAddress.textContent = result;
      });

      await this.freelancerContract.methods.clientAddress().call().then((result) =>{
        this.uiLblClientAddress.textContent = result;
      });

      await this.freelancerContract.methods.projectState().call().then((result) =>{
        this.freelancerContractStatus = result;
        this.utilProjectStatus(parseInt(result));
      });

  },

  retrieveFreelancer: function(ContractAddress, who="freelancer"){
    try {
        this.utilRefreshHeader(ContractAddress);
        if (who === "freelancer"){
          this.utilRefreshScheduleTable();
        }
        else{
          this.utilRefreshScheduleTableClient();
        }
        this.uiBtnDeployPopover.hide();
    } catch (error) {
      this.uiBtnDeployPopover.show();
    }
  },

  deployFreelancer: function() {
    const { web3 } = this;
    this.freelancerContract = new web3.eth.Contract(freelancerArtifact.abi);
    this.uiSpnLoad = document.getElementById("spn-load");
    this.uiConContract = document.getElementById("con-contract");
    this.uiLblContractAddress = document.getElementById("lbl-contract-address");
    this.uiLblFreelancerAddress = document.getElementById("lbl-freelancer-address");

    this.uiSpnLoad.classList.remove('d-none');
    this.freelancerContract.deploy({
      data: freelancerArtifact.bytecode,
      arguments: []
    }).send({
      from: this.account, 
    }, (error, transactionHash) => {})
    .on('error', (error) => { 
      console.log("error");            
    })
    .on('receipt', (receipt) => {
      console.log("DONE" + receipt.contractAddress); // contains the new contract address
      this.uiSpnLoad.classList.add('d-none');
      this.uiConContract.classList.remove('d-none');

      this.freelanceContractAddress = receipt.contractAddress;
      this.uiLblContractAddress.textContent = receipt.contractAddress;

      this.freelancerContract = new web3.eth.Contract(freelancerArtifact.abi, this.freelanceContractAddress);
      this.freelancerContract.methods.freelancerAddress().call().then((result) =>{
        this.uiLblFreelancerAddress.textContent = result;
      });

      this.freelancerContract.methods.projectState().call().then((result) =>{
        this.utilProjectStatus(0);
      });

      //update the ETH Value boxes
      this.utilGetEthValue();
      this.utilToggerActionBtns("freelancer");
    })
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});