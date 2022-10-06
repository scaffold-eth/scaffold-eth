import React, { Component } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { SignEthereumTransactionResponse } from "walletlink/dist/relay/Web3Response";

class FDPAgenda extends Component {
  constructor(props) {
    super(props);

    this.calendarRef = React.createRef();

    this.state = {
      startDate: "2022-06-11T09:30:00", //DayPilot.Date.today(),
      eventHeight: 30,
      headerHeight: 30,
      cellHeaderHeight: 20,
      onBeforeEventRender: args => {
        args.data.borderColor = "darker";
        if (args.data.backColor) {
          args.data.barColor = DayPilot.ColorUtil.darker(args.data.backColor, -1);
        }
      },
      contextMenu: new DayPilot.Menu({
        items: [
          {
            text: "Lavender",
            icon: "icon icon-blue",
            color: "#ccd3ff",
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "pastel",
            icon: "icon icon-green",
            color: "#a6b7ff",
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "cloud",
            icon: "icon icon-yellow",
            color: "#8391cd",
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "blue pastel",
            icon: "icon icon-red",
            color: "#6784ff",
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "Electric",
            color: "#455ef8",
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "Transparent",
            color: null,
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "-",
          },
          {
            text: "Delete",
            onClick: args => {
              const e = args.source;
              this.calendar.events.remove(e);
            },
          },
        ],
      }),
      schedule: { conference: { rooms: [] } },
      columns: [
        { name: "Room 1", id: "1" },
        { name: "Room 2", id: "2" },
      ],
      events: [
        {
          id: 1,
          text: "Event 1",
          start: "2022-06-11T11:30:00",
          end: "2022-06-11T11:30:00",
          barColor: "#fcb711",
          resource: "R1",
          description: "Event 1 description",
        },
        {
          id: 2,
          text: "Event 2",
          start: "2022-06-11T11:30:00",
          end: "2022-06-11T13:00:00",
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
  updateColor(e, color) {
    e.data.backColor = color;
    this.calendar.events.update(e);
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
