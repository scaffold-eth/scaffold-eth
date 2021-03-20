import React, { useState } from "react";
import { Card, Button, Modal, Space, Row, Col, Divider} from "antd";

const style = { background: '#0092ff', padding: '8px 0' };

export default function MemCard({isWitness, name}) {
  return (
    <div >
        <Card>
            <h2>
              {name}
            </h2>
            <p> Description</p>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col className="gutter-row" span={isWitness ? 12 : 24}>
          <Button type="primary">
            Details
          </Button>
      </Col>
          {isWitness && <Col className="gutter-row" span={12}>
            <Button type="primary">
              Judge
            </Button>
          </Col>
          }
    </Row>
    </Card>
  </div>
  );
}
