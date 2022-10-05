import React, { Component } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { SignEthereumTransactionResponse } from "walletlink/dist/relay/Web3Response";

class FDPAgenda extends Component {
  constructor(props) {
    super(props);

    this.calendarRef = React.createRef();

    this.state = {
      startDate: "2022-08-11",
      schedule: { conference: { rooms: [] } },
      columns: [
        { name: "Room 1", id: "1" },
        { name: "Room 2", id: "2" },
      ],
      events: [
        {
          id: 1,
          text: "Event 1",
          start: "2022-08-11T11:00:00",
          end: "2022-08-11T13:30:00",
          barColor: "#fcb711",
          resource: "R1",
          description: "Event 1 description",
        },
        {
          id: 2,
          text: "Event 2",
          start: "2022-08-11T11:30:00",
          end: "2022-08-11T13:00:00",
          barColor: "#f37021",
          resource: "R2",
        },
      ],
      onHeaderClick: async args => {
        console.log(this.calendar.events);
      },
    };
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  loadEventsData() {
    console.log(this.state.schedule);
    var columns = [];
    var events = [];
    var rooms = this.state.schedule.conference.rooms;
    rooms.forEach((room, i) => {
      console.log(room);
      columns.push({ name: room.name, id: room.guid });
    });

    console.log("columns", columns);
    console.log("events", events);
    this.calendar.update({ startDate: this.state.startDate, columns, events: this.state.events });
  }

  async componentDidMount() {
    const result = await (await fetch("schedule.json")).json();
    this.setState({ schedule: result.schedule });

    this.loadEventsData();
  }

  render() {
    return <DayPilotCalendar {...this.state} ref={this.calendarRef} />;
  }
}

export default FDPAgenda;
