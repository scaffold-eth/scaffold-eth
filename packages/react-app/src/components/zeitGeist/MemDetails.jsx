import React, { useState } from "react";
import { Card, Button, Modal, Space, Row, Col, Divider} from "antd";
// import MemDetails from "./MemDetails"

export default function MemDetails({name, description, isWitness, isPlayer}) {
    return <div>
        <p> {description}</p>
        </div>
}
