import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { Card, Row, Col, Input, Divider } from "antd";
import { useBalance, useContractLoader } from "../hooks";
import { Account } from ".";

const tryToDisplay = (thing) => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      return ethers.utils.formatUnits(thing, "ether");
    }
  }
  return JSON.stringify(thing);
};

export default function Contract(props) {
  const contracts = useContractLoader(props.provider);
  const contract = contracts ? contracts[props.name] : "";
  const address = contract ? contract.address : "";
  const balance = useBalance(address, props.provider);

  const [display, setDisplay] = useState(<div>Loading...</div>);

  const [form, setForm] = useState({});
  const [values, setValues] = useState({});

  useEffect(() => {
    const loadDisplay = async () => {
      //console.log("CONTRACT",contract)
      if (contract) {
        let nextDisplay = [];
        let displayed = {};
        for (let f in contract.interface.functions) {
          let fn = contract.interface.functions[f];
          //console.log("FUNCTION",fn.name,fn)

          if (props.show && props.show.indexOf(fn.name) < 0) {
            //do nothing
          } else if (
            !displayed[fn.name] &&
            fn.type == "call" &&
            fn.inputs.length === 0
          ) {
            //console.log("PUSHING",fn.name)
            displayed[fn.name] = true;
            nextDisplay.push(
              <div>
                <Row>
                  <Col
                    span={8}
                    style={{
                      textAlign: "right",
                      opacity: 0.333,
                      paddingRight: 6,
                      fontSize: 24,
                    }}
                  >
                    {fn.name}
                  </Col>
                  <Col span={16}>
                    <h2>{tryToDisplay(await contract[fn.name]())}</h2>
                  </Col>
                </Row>
                <Divider></Divider>
              </div>
            );
          } else if (
            !displayed[fn.name] &&
            (fn.type === "call" || fn.type === "transaction")
          ) {
            //console.log("RENDERING",fn)
            //console.log("CALL WITH ARGS",fn.name,fn)
            displayed[fn.name] = true;
            let inputs = [];
            for (let i in fn.inputs) {
              let input = fn.inputs[i];
              inputs.push(
                <div style={{ margin: 2 }}>
                  <Input
                    size="large"
                    placeholder={input.name}
                    value={form[fn.name + input.name + i]}
                    onChange={(e) => {
                      let formUpdate = { ...form };
                      formUpdate[fn.name + input.name + i] = e.target.value;
                      setForm(formUpdate);
                      if (props.formUpdate) {
                        props.formUpdate(formUpdate);
                      }
                    }}
                  />
                </div>
              );
            }

            //console.log("VALUE OF ",fn.name, "IS",values[fn.name])

            let buttonIcon = "📡";
            let afterForm = "";

            if (fn.type != "call") {
              if (fn.payable) {
                buttonIcon = "💸";
                afterForm = (
                  <Input
                    placeholder={"transaction value"}
                    onChange={(e) => {
                      console.log("CHJANGE");
                      let newValues = { ...values };
                      newValues["valueOf" + fn.name] = e.target.value;
                      console.log("SETTING:", newValues);
                      setValues(newValues);
                    }}
                    value={values["valueOf" + fn.name]}
                    addonAfter={
                      <div>
                        <Row>
                          <Col span={16}>
                            <div
                              type="dashed"
                              onClick={async () => {
                                console.log("CLICK");

                                let newValues = { ...values };
                                newValues["valueOf" + fn.name] =
                                  "" +
                                  parseFloat(newValues["valueOf" + fn.name]) *
                                    10 ** 18;
                                console.log("SETTING:", newValues);
                                setValues(newValues);
                              }}
                            >
                              {"✳️"}
                            </div>
                          </Col>
                          <Col span={16}>
                            <div
                              type="dashed"
                              onClick={async () => {
                                console.log("CLICK");

                                let newValues = { ...values };
                                let bigNumber = ethers.utils.bigNumberify(
                                  newValues["valueOf" + fn.name]
                                );
                                newValues[
                                  "valueOf" + fn.name
                                ] = bigNumber.toHexString();
                                console.log("SETTING:", newValues);
                                setValues(newValues);
                              }}
                            >
                              {"#️⃣"}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    }
                  />
                );
              } else {
                buttonIcon = "💸";
              }
            }

            inputs.push(
              <div style={{ cursor: "pointer", margin: 2 }}>
                {afterForm}
                <Input
                  onChange={(e) => {
                    console.log("CHJANGE");
                    let newValues = { ...values };
                    newValues[fn.name] = e.target.value;
                    console.log("SETTING:", newValues);
                    setValues(newValues);
                  }}
                  defaultValue=""
                  value={values[fn.name]}
                  addonAfter={
                    <div
                      type="default"
                      onClick={async () => {
                        console.log("CLICK");
                        let args = [];
                        for (let i in fn.inputs) {
                          let input = fn.inputs[i];
                          args.push(form[fn.name + input.name + i]);
                        }
                        console.log("args", args);

                        let overrides = {};
                        if (values["valueOf" + fn.name]) {
                          overrides = {
                            value: values["valueOf" + fn.name], //ethers.utils.parseEther()
                          };
                        }

                        //console.log("Running with extras",extras)
                        let result = tryToDisplay(
                          await contract[fn.name](...args, overrides)
                        );

                        let newValues = { ...values };
                        newValues[fn.name] = result;
                        console.log("SETTING:", newValues);
                        setValues(newValues);
                      }}
                    >
                      {buttonIcon}
                    </div>
                  }
                />
              </div>
            );

            nextDisplay.push(
              <div>
                <Row>
                  <Col
                    span={8}
                    style={{
                      textAlign: "right",
                      opacity: 0.333,
                      paddingRight: 6,
                      fontSize: 24,
                    }}
                  >
                    {fn.name}
                  </Col>
                  <Col span={16}>{inputs}</Col>
                </Row>
                <Divider></Divider>
              </div>
            );
          } else if (!displayed[fn.name]) {
            console.log("UNKNOWN FUNCTION", fn);
          }
        }
        setDisplay(nextDisplay);
      }
    };
    loadDisplay();
  }, [contracts, contract, values, form]);

  return (
    <Card
      title={
        <div>
          {props.name}
          <div style={{ float: "right" }}>
            <Account
              address={address}
              localProvider={props.provider}
              injectedProvider={props.provider}
              mainnetProvider={props.provider}
              readContracts={contracts}
              price={props.price}
            />
            {props.account}
          </div>
        </div>
      }
      size="large"
      style={{ width: 850, margin: "0 auto", marginTop: 25 }}
      loading={display && display.length <= 0}
    >
      {display}
    </Card>
  );
}
