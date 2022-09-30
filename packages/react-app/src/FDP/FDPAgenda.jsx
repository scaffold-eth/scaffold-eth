import React, { Component } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

class FDPAgenda extends Component {
  constructor(props) {
    super(props);

    this.calendarRef = React.createRef();

    this.state = {
      events: [
        {
          id: 1,
          text: "Event 1",
          start: "2022-30-09T11:00:00",
          end: "2022-30-09T13:30:00",
          barColor: "#fcb711",
          resource: "R1",
        },
        {
          id: 2,
          text: "Event 2",
          start: "2022-11-07T10:00:00",
          end: "2022-11-07T12:00:00",
          barColor: "#f37021",
          resource: "R2",
        },
      ],
    };
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  render() {
    return <DayPilotCalendar {...this.state} ref={this.calendarRef} />;
  }
}

export default FDPAgenda;
