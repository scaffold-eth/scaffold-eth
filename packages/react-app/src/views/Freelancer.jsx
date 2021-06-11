/* eslint-disable jsx-a11y/accessible-emoji */

import { Contract, ContractFactory } from "@ethersproject/contracts";
import { formatEther, parseEther } from "@ethersproject/units";
import { Select } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { Address, AddressInput } from "../components";
import { useContractReader, useExternalContractLoader, useOnBlock } from "../hooks";
import 'react-bootstrap';
import { Modal, Popover, Button, Form } from 'react-bootstrap';
import { notification } from "antd";

export default function Freelancer({
  address,
  readContracts,
  userProvider,
  localProvider,
  tx
}) 
{
  //TODO: Lots of repeated code between both views. Look into how to refactor into components

  useOnBlock(localProvider, () => {
    console.log(`⛓ A new block is here: ${localProvider._lastBlockNumber}`);
    if(freelancerContract){
      loadContractData(freelancerContract);
    }
  });

  function parseProjectState(enumIndex){
    switch (enumIndex) {
      case 0:
        return "Initiated";
      case 1:
        return "Accepted";
      case 2:
        return "Closed";
    }
  }

  function parseScheduleState(enumIndex){
    switch (enumIndex) {
      case 0:
        return "Planned";
      case 1:
        return "Funded";
      case 2:
        return "Started";
      case 3:
        return "Approved";
      case 4:
        return "Released";
    }
  }

  function showNotification(tx){
    notification.info({
            message: "Transaction Sent",
            description: tx.hash,
            placement: "bottomRight",
            duration:10,
          });
  }

  const contractAddressInputRef = useRef(null);

  const ABI = require("../contracts/Freelancer.abi");
  const BYTECODE = require("../contracts/Freelancer.bytecode");
  const [freelancerContractAddress, setFreelancerContractAddress] = useState(""); // 0x5FbDB2315678afecb367f032d93F642f64180aa3

  const [freelancerContract, setFreelancerContract] = useState("");
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [projectState, setProjectState] = useState();
  const [schedules, setSchedules] = useState();
  const [totalFundsBalance, SetTotalFundsBalance] = useState("0");
  const [totalFundsDisbursed, SetTotalFundsDisbursed] = useState("0");

  async function loadFreelanceContract(){
    try{
      if(contractAddressInputRef.current.value == ""){
        deployNewContract();
      }else{
        const fcontract = new Contract(contractAddressInputRef.current.value, ABI, userProvider.getSigner());
        setFreelancerContract(fcontract);
        loadContractData(fcontract);
      }

     
    }catch (e) {
      console.log(e);
      alert("Invalid contract address");
    }
  }

  async function deployNewContract(){
    try{
      const factory = new ContractFactory(ABI, BYTECODE,  userProvider.getSigner());
      const fcontract = await factory.deploy();
      showNotification(fcontract)
      await fcontract.deployed();
      setFreelancerContract(fcontract);
      loadContractData(fcontract);
    }catch (e) {
      console.log(e);
    }
  }

  async function loadContractData(fcontract){
    setFreelancerAddress(await fcontract.freelancerAddress());
    setClientAddress(await fcontract.clientAddress());
    setProjectState(await fcontract.projectState());
    SetTotalFundsBalance(await fcontract.getBalance());
    SetTotalFundsDisbursed(await fcontract.totalFundsDisbursed());
    setFreelancerContractAddress(contractAddressInputRef.current.value);

    const scheduleCount = await fcontract.totalSchedules();

    const scheduleUpdate = [];
    
      for (let scheduleIndex = 0; scheduleIndex < scheduleCount; scheduleIndex++) {
        try {
          const scheduleItem = await fcontract.scheduleRegister(scheduleIndex);
          scheduleUpdate.push({ 
            id:scheduleIndex, 
            shortCode:scheduleItem.shortCode, 
            description:scheduleItem.description, 
            state:scheduleItem.scheduleState, 
            ethValue:scheduleItem.value
          });
        } catch (e) {
          console.log(e);
        }
      }
      setSchedules(scheduleUpdate);
  }

  async function endProject(){
    const tx = await freelancerContract.endProject();
    showNotification(tx);
    await tx.wait();
    loadContractData(freelancerContract);
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [ form, setForm ] = useState({})

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
  }

  async function addSchedule(){
    const tx = await freelancerContract.addSchedule(form["shortCode"],form["description"],parseEther((form["value"]).toString()))
    showNotification(tx)
    handleClose();
    await tx.wait();
    loadContractData(freelancerContract);
  }

  async function startTask(_id){
    const tx = await freelancerContract.startTask(_id);
    showNotification(tx)
    await tx.wait();
    loadContractData(freelancerContract);
  }

  async function releaseFunds(_id){
    const tx = await freelancerContract.releaseFunds(_id);
    showNotification(tx)
    await tx.wait();
    loadContractData(freelancerContract);
  }

  let scheduleList = []

  for(let i in schedules){

    let btn;
    if(schedules[i].state == 1)
      btn = <Button onClick={() => {startTask(schedules[i].id);}}>Start Task</Button>
    else if(schedules[i].state == 3)
      btn = <Button onClick={() => {releaseFunds(schedules[i].id);}}>Release Funds</Button>
    else
      btn = <p>Awaiting client action</p>

    scheduleList.push(
      <tr key={schedules[i].id}>
        <td>{schedules[i].shortCode}</td>
        <td>{schedules[i].description}</td>
        <td>{"Ξ " + formatEther(schedules[i].ethValue)}</td>
        <td>{parseScheduleState(schedules[i].state)}</td>
        <td>{btn}</td>
      </tr>
    )
  }

  return (
    <div style={{paddingBottom: 128, marginBottom:128 }}>
      <div className="p-1 mb-5 bg-light bg-gradient rounded-3">
        <div className="container-fluid py-3">
            <h1 className="display-7 fw-bold">Freelancer Smart Contract</h1>
            <p className="col-md-8 fs-4">This is the freelancer's Distributed App</p>
            <div className="row">
              <div className="col-8">
                  <div className="input-group input-group-lg">
                  <input type="text" className="form-control" placeholder={freelancerContractAddress} id="txt-contract-address" ref={contractAddressInputRef} />
                  </div>
              </div>
              <div className="col-4">
                  <a tabIndex="0"  className="btn btn-primary btn-lg" 
                  onClick={() => {
                    loadFreelanceContract();
                  }}
                  type="button" id="btn-Deploy"
                  data-bs-toggle="popover" title="Error" 
                  data-bs-content="Smart Contract Not Found"
                  data-bs-trigger="manual">
                  Go
                  </a>
                  <div className="spinner-border spinner-border-sm d-none" role="status" id="spn-load">
                  <span className="sr-only"></span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-2" id="con-contract">
          <div className="row">
            <div className="col-6">
              <ul className="list-group">
                  <li className="list-group-item"><span className="fw-bold">Address: {freelancerContract.address}</span><span id="lbl-contract-address"></span></li>
                  <li className="list-group-item"><span className="fw-bold">Freelancer's Wallet: {freelancerAddress}</span><span id="lbl-freelancer-address"></span></li>
                  <li className="list-group-item"><span className="fw-bold">Client's Wallet: {clientAddress}</span><span id="lbl-client-address"></span></li>
                  <li className="list-group-item"><span className="fw-bold">Project State: {parseProjectState(projectState)}</span><span className="badge" id="lbl-project-status"></span></li>
              </ul>
            </div>
            <div className="col-3">
              <div className="card">
                  <div className="card-header fw-bold text-center">Total Value (ETH)</div>
                  <div className="card-body">
                  <p className="card-text text-center"><span className="fs-1" id="lbl-total-eth">{formatEther(totalFundsBalance)}</span></p>
                  </div>
              </div>
            </div>
            <div className="col-3">
              <div className="card">
                  <div className="card-header fw-bold text-center">Disbursed (ETH)</div>
                  <div className="card-body">
                  <p className="card-text text-center"><span className="fs-1" id="lbl-disbursed-eth">{formatEther(totalFundsDisbursed)}</span></p>
              </div>
            </div>
          </div>
        </div>

        <br />
        {
          projectState == 0 && (
          <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#scheduleModal" id="btn-Add-Schedule" onClick={handleShow}>Add Schedule</button>
        )}
        {
          freelancerContract && projectState ==1 && totalFundsBalance == 0 && ( 
          <button className="btn btn-primary btn-lg" type="button" id="btn-End-Project" 
          onClick={() => {endProject();}}>End Project</button>
        )}
        <div className="spinner-border spinner-border-sm d-none" role="status" id="spn-contract-action"></div>
        </div>


        <table className="table table-striped table-hover mb-5 pb-5" id="tbl-schedule-table">
        <thead>
            <tr>
            <th scope="col" data-field="short-code">Short Code</th>
            <th scope="col" data-field="description">Description</th>
            <th scope="col" className="text-end" data-field="value">Value (in ETH)</th>
            <th scope="col" data-field="state">State</th>
            <th scope="col" data-field="state">Action</th>
            </tr>
        </thead>
        <tbody id="schedule-table-body">
            {scheduleList}
        </tbody>
        </table>

        {/* Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a new schedule</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group >
              <Form.Label>Short Code: </Form.Label>
              <Form.Control type="text" onChange={ e => setField('shortCode', e.target.value) } placeholder="Enter short code e.g. DEV"/>           
            </Form.Group>
            <Form.Group >
              <Form.Label>Description: </Form.Label>
              <Form.Control type="text" onChange={ e => setField('description', e.target.value) } placeholder="Enter description e.g. Development Stage" />           
            </Form.Group>
            <Form.Group >
              <Form.Label>Value: </Form.Label>
              <Form.Control type="number" onChange={ e => setField('value', e.target.value) } placeholder="Enter value (in ETH) to be paid when done" required />           
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {addSchedule();}}>
              Submit Schedule
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}
