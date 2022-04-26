import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";

const DisplayVariable = ({ contractFunction, functionInfo, refreshRequired, triggerRefresh, blockExplorer }) => {
  const [variable, setVariable] = useState("");

  const refresh = useCallback(async () => {
    try {
      const funcResponse = await contractFunction();
      setVariable(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setVariable, contractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, contractFunction]);

  return (
    <div>
      <Row>
        <Col
          span={8}
          style={{
            paddingRight: 6,
            fontSize: 24,
          }}
        >
          <div
            className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-blue-100 text-gray-800 dark:bg-gray-900 dark:text-white"
            style={{
              fontSize: 14,
              marginRight: 15,
              float: "right",
            }}
          >
            {functionInfo.name}
          </div>
        </Col>
        <Col span={14}>
          <div>
            <h2 className="text-gray-900 dark:text-white" style={{ marginTop: 3 }}>
              {tryToDisplay(variable, false, blockExplorer)}
            </h2>
          </div>
          <div style={{ float: "left" }}>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={refresh}
            >
              Refetch
            </button>
          </div>
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default DisplayVariable;
