import React, { Component } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { notification, Spin } from "antd";
import * as FairOS from "./FairOS.js";

class FDPAgenda extends Component {
  constructor(props) {
    super(props);

    this.calendarRef = React.createRef();

    this.state = {
      isBusy: false,
      startDate: DayPilot.Date.today(), // "2022-06-11T09:30:00",
      eventHeight: 30,
      headerHeight: 30,
      cellHeaderHeight: 20,
      onTimeRangeSelected: async args => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event " + dp.events.list.length);
        console.log(dp.events.list, args);
        dp.clearSelection();
        if (!modal.result) {
          return;
        }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result,
          resource: args.resource,
          tags: { status: "new" },
        });
        this.setState({ events: dp.events.list });
        await this.uploadEvents(dp.events.list);
      },
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
              this.uploadEvents(this.calendar.events.list);
            },
          },
        ],
      }),
      schedule: { conference: { rooms: [] } },
      columns: [
        { name: "Room 1", id: "1" },
        { name: "Room 2", id: "2" },
      ],
      events: [],
      // events: [
      //   {
      //     id: 1,
      //     text: "Event 1",
      //     start: "2022-06-11T11:30:00",
      //     end: "2022-06-11T11:30:00",
      //     barColor: "#fcb711",
      //     resource: "R1",
      //     description: "Event 1 description",
      //   },
      //   {
      //     id: 2,
      //     text: "Event 2",
      //     start: "2022-06-11T11:30:00",
      //     end: "2022-06-11T13:00:00",
      //     barColor: "#f37021",
      //     resource: "R2",
      //   },
      // ],
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

  /*loadEventsData() {
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
  }*/

  async downloadEvents() {
    var columns = [];
    this.setState({ isBusy: true });
    notification.info({
      message: "Events",
      description: "Loading...",
    });
    try {
      var response = await FairOS.downloadFile(FairOS.fairOShost, "agenda", "/", "events.0.json");
      var json = await response.json();
      console.log("from events file", json);
      this.setState({ events: json.events });
      this.calendar.update({ startDate: this.state.startDate, columns, events: json.events });

      if (json.events === undefined) {
        /*notification.warning({
          message: "No events",
          description: "There are no events loaded",
        });*/
        this.setState({ isBusy: false });
        return;
      }

      notification.success({
        message: json.events.length + " Events",
        description: "Loaded from storage",
      });
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message,
      });
    }
    this.setState({ isBusy: false });
  }
  async uploadEvents(events) {
    var columns = [];
    var eventsObject = { events: events };
    this.setState({ isBusy: true });
    notification.info({
      message: "Saving",
      description: "Please wait ...",
    });
    try {
      var res = await FairOS.uploadObjectAsFile(FairOS.fairOShost, "agenda", "/", "events.0.json", eventsObject);
      var response = await res.json();
      console.log("uploaded events file", response);
      //this.calendar.update({ startDate: this.state.startDate, columns, events: json.events });
      notification.success({
        message: response.Responses[0].message,
        description: "Stored as " + response.Responses[0].file_name,
      });
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Error",
        description: err.message,
      });
    }
    this.setState({ isBusy: false });
  }

  async componentDidMount() {
    const result = await (await fetch("schedule.json")).json();
    this.setState({ schedule: result.schedule });

    //this.loadEventsData();
    await this.downloadEvents();
  }

  render() {
    return (
      <>
        {this.state.isBusy && <Spin />}
        <div style={{ margin: "2%", maxHeight: "60vh" }}>
          <DayPilotCalendar {...this.state} ref={this.calendarRef} />;
        </div>
      </>
    );
  }
}

export default FDPAgenda;
