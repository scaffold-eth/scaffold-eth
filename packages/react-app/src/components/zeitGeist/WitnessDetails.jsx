import React, { useState } from "react";
import { Form, Card, Button, Modal, Space, Row, Col, Divider} from "antd";
import MintMemoryDrawer from "./MintMemoryDrawer"

export default function WitnessDetails({
    a_id, description, markAsCompleted
}) {
    return (
    <div>
        <p>Finalize memory. This is what you aimed for:</p>
        <Divider />
            <div>
            <p>Click here if it worked</p>
            <MintMemoryDrawer 
                description={description}
                a_id={a_id}
                markAsCompleted={markAsCompleted}
            />
            </div>
        <Divider />
        <div>
            <p>Naaah, it didnt...</p>
            <Button type="primary">
                just another day
            </Button>
        </div>
    </div>
    )
}
