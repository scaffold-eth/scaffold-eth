import React, { Component } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

class FDPCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: "Week",
    };
  }

  render() {
    const { ...config } = this.state;
    return (
      <div>
        <DayPilotCalendar {...config} />
      </div>
    );
  }
}

export default FDPCalendar;
