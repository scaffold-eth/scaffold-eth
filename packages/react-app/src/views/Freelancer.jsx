/* eslint-disable jsx-a11y/accessible-emoji */

import { Contract } from "@ethersproject/contracts";
import { formatEther } from "@ethersproject/units";
import { Select } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { Address, AddressInput } from "../components";
import { useContractReader, useExternalContractLoader } from "../hooks";
import 'react-bootstrap';
import { Modal, Popover } from 'react-bootstrap';

export default function Freelancer({
  address,
  readContracts,
  userProvider,
  tx
}) 
{
  function parseProjectState(enumIndex){
    switch (enumIndex) {
      case 0:
        return "initiated";
      case 1:
        return "accepted";
      case 2:
        return "closed";
    }
  }

  const contractAddressInputRef = useRef(null);

  const ABI = require("../contracts/Freelancer.abi");
  const [freelancerContractAddress, setFreelancerContractAddress] = useState(""); // 0x5FbDB2315678afecb367f032d93F642f64180aa3

  const [freelancerContract, setFreelancerContract] = useState("");
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [projectState, setProjectState] = useState();

  async function loadFreelanceContract(){
    console.log(freelancerContract);
    try{
      const fcontract = new Contract(contractAddressInputRef.current.value, ABI, userProvider.getSigner());
      setFreelancerContract(fcontract);
      setFreelancerAddress(await fcontract.freelancerAddress());
      setProjectState(await fcontract.projectState());
      setFreelancerContractAddress(contractAddressInputRef.current.value);
    }catch (e) {
      console.log(e);
      alert("Invalid contract address");
    }
  }

  async function endProject(){
    try{
      tx(freelancerContract.endProject());
    }catch (e) {
      console.log(e);
    }
  }


  return (
      <div>
          <div className="p-1 mb-1 bg-light bg-gradient rounded-3">
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
                  <a tabindex="0"  className="btn btn-primary btn-lg" 
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
                  <li className="list-group-item"><span className="fw-bold">Address: </span><span id="lbl-contract-address"></span></li>
                  <li className="list-group-item"><span className="fw-bold">Freelancer's Wallet: {freelancerAddress}</span><span id="lbl-freelancer-address"></span></li>
                  <li className="list-group-item"><span className="fw-bold">Client's Wallet: </span><span id="lbl-client-address"></span></li>
                  <li className="list-group-item"><span className="fw-bold">Project State: {parseProjectState(projectState)}</span><span className="badge" id="lbl-project-status"></span></li>
              </ul>
              </div>
              <div className="col-3">
              <div className="card">
                  <div className="card-header fw-bold text-center">Total Value (ETH)</div>
                  <div className="card-body">
                  <p className="card-text text-center"><span className="fs-1" id="lbl-total-eth"></span></p>
                  </div>
              </div>
              </div>
              <div className="col-3">
              <div className="card">
                  <div className="card-header fw-bold text-center">Disbursed (ETH)</div>
                  <div className="card-body">
                  <p className="card-text text-center"><span className="fs-1" id="lbl-disbursed-eth"></span></p>
              </div>
              </div>
              </div>
          </div>

          <br />

          <button type="button" className="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#scheduleModal" id="btn-Add-Schedule">Add Schedule</button>
          <button className="btn btn-primary btn-lg" type="button" id="btn-End-Project" 
          onClick={() => {
                    endProject();
                  }}>End Project</button>
          <button className="btn btn-success btn-lg" type="button" id="btn-Refresh" onclick="App.btnRefresh('freelancer')">Refresh</button>
          <div className="spinner-border spinner-border-sm d-none" role="status" id="spn-contract-action"></div>
          </div>


          <table className="table table-striped table-hover d-none" id="tbl-schedule-table">
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

          </tbody>
          </table>

          {/* Modal */}
          <div className="modal fade" id="scheduleModal" tabindex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title" id="scheduleModalLabel">New Schedule</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form id="Schedule-Form" onsubmit="return false">
              <div className="modal-body">
                  <div className="mb-3">
                      <label for="txt-short-code" className="col-form-label">Short Code:</label>
                      <input type="text" className="form-control" placeholder="Enter short code e.g. DEV" value="UAT" id="txt-short-code" required />
                  </div>
                  <div className="mb-3">
                      <label for="txt-schedule-description" className="col-form-label">Description:</label>
                      <input type="text" className="form-control" placeholder="Enter description e.g. Development Stage" value="User Acceptance Testing" id="txt-schedule-description" required />
                  </div>
                  <div className="mb-3">
                      <label for="txt-schedule-value" className="col-form-label">Value</label>
                      <input type="number" min="0" step="any" className="form-control" id="txt-schedule-value" value="1.5" placeholder="Enter value (in ETH) to be paid when done" required />
                  </div>
              </div>
              <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" id="btn-Add-Schedule" onclick="App.btnAddSchedule()">Go</button>
                  <div className="spinner-border spinner-border-sm d-none" role="status" id="spn-add-schedule"></div>
              </div>
              </form>
              </div>
          </div>
          </div>
      </div>
  )
}
