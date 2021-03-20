import React, { useState } from "react";
import { Card, Button, Modal, Space, Row, Col, Divider} from "antd";
// import MemDetails from "./MemDetails"

export default function MemDetails({
    description, player, witness, a_id, becomeWitness
}) {
    return (
    <div>
        <p> {description}</p>
        <p> player: {player}</p>
        <p> witness: {witness ? witness : "none yet"}</p>
        <Button onClick={() => becomeWitness(a_id)}>Become Witness</Button>
    </div>
    )
}
