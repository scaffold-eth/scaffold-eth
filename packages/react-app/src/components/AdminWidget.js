import React, { useState } from 'react'
import { Row, Button } from 'antd';
import { CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Provider, Faucet, Ramp } from "."

export default function AdminWidget(props) {

  const [admin, setAdmin] = useState(false)

  let adminWidgets
  if (admin) {
    adminWidgets = (
      <>
      <div style={{ position: 'fixed', textAlign: 'right', left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Button style={{ marginTop: 16 }} shape="round" size="small" onClick={() => {
            setAdmin(false)
          }}><CloseCircleOutlined /></Button>
        </Row>
          <Row align="middle" gutter={4}>
            <Provider name={"mainnet"} provider={props.mainnetProvider} />
        </Row>
        <Row align="middle" gutter={4}>
            <Provider name={"local"} provider={props.localProvider} />
          </Row>
          <Row align="middle" gutter={4}>
            <Provider name={"injected"} provider={props.injectedProvider} />
        </Row>
          <Row align="middle" gutter={4}>
              <Ramp
                price={props.price}
                address={props.address}
              />
          </Row>
          <Row align="middle" gutter={4}>
              <Faucet
                localProvider={props.localProvider}
                price={props.price}
              />
          </Row>
      </div>
      </>
    )
  } else {
    adminWidgets = (
    <div style={{ position: 'fixed', textAlign: 'right', left: 0, bottom: 20, padding: 10 }}>
    <Button style={{ marginTop: 16 }} shape="round" size="large" onClick={() => {
      setAdmin(true)
    }}><QuestionCircleOutlined /></Button>
    </div>
  )
  }

  return adminWidgets;
}
