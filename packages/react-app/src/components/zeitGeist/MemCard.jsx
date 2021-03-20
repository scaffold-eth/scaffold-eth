import React, { useState } from "react";
import { Card, Button, Modal, Space, Row, Col, Divider} from "antd";
import MemDetails from "./MemDetails"
import WitnessDetails from "./WitnessDetails"
import MintMemoryDrawer from "./MintMemoryDrawer"

const style = { background: '#0092ff', padding: '8px 0' };

export default function MemCard({isWitness, name}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div >
        <Card>
          <h2>
            {name}
          </h2>
          <p> Description</p>
        <Button type="primary" onClick={showModal}>
          {isWitness ? "judge" : "see Details"}
          {/* More */}
        </Button>
      </Card>

      <Modal 
      title={name} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
      description="some description" isWitness={isWitness} isPlayer={true}
      >
        {!isWitness ? <MemDetails /> : <WitnessDetails description="some descr"/>}
      </Modal>
  </div>
  );
}


