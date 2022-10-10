import React, { Component } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import { ResourceGroups } from "./ResourceGroups";
import { notification, Button, Modal, Spin } from "antd";
import * as FairOS from "./FairOS.js";

var stringToColor = function (str) {
  return "#886699";
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

var stringToColorFade = function (str) {
  return stringToColor(str) + "44";
};

class FDPCalendar extends Component {
  constructor(props) {
    super(props);
    this.calendarRef = React.createRef();
    this.datePickerRef = React.createRef();
    this.dateRef = React.createRef();

    this.state = {
      open: false,
      isDirty: false,
      isBusy: false,
      modalEvent: null,
      //viewType: "Week",
      startDate: "2022-08-11",
      selectionDay: "2022-08-11",
      viewType: "Resources",
      durationBarVisible: true,
      timeRangeSelectedHandling: "Enabled",
      tracks: [],
      persons: [],
      columns: [],
      contextMenu: new DayPilot.Menu({
        items: [
          {
            text: "Attend",
            color: "#38ff6433",
            onClick: args => {
              const e = args.source;
              //this.calendar.events.remove(e);
              this.updateColor(args.source, args.item.color);
              console.log("attend", args.source.data);
              //this.setState
              //this.uploadEvents([...this.state.yourEvents, args.source.data]);
              // TODO: add to your events
            },
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
          {
            text: "-",
          },
          {
            text: "Transparent",
            color: null,
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "Lavender",
            color: "#a6b7ff55",
            onClick: args => this.updateColor(args.source, args.item.color),
          },
          {
            text: "Grass",
            color: "#7fc18a55",
            onClick: args => this.updateColor(args.source, args.item.color),
          },
        ],
      }),
      events: [
        {
          id: 99991,
          text: "Event 1",
          start: "2022-05-11T11:00:00",
          end: "2022-05-11T13:30:00",
          barColor: "#fcb711",
          resource: "0",
          description: "Event 1 description",
        },
      ],

      yourEvents: [],

      // onHeaderClick: async args => {
      //   const modal = await DayPilot.Modal.prompt("Resource name:", args.column.name);
      //   if (!modal.result) {
      //     return;
      //   }
      //   args.column.data.name = modal.result;
      //   this.calendar.update();
      // },
      onTimeRangeSelected: async args => {
        const dp = this.calendar;
        var eventNum = this.state.yourEvents === undefined ? 0 : this.state.yourEvents.length;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event " + eventNum);
        console.log(dp.events, args);
        dp.clearSelection();
        if (!modal.result) {
          return;
        }
        var event = {
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result,
          resource: args.resource,
          tags: { persons: [], links: [], title: modal.result },
        };
        dp.events.add(event);
        this.setState({ events: dp.events.list });
        this.attendEvent(event);
        //this.setState(prevState => ({ yourEvents: [...prevState.yourEvents, event] }));
        //this.uploadEvents([...this.state.yourEvents, event]);
      },
      onEventClick: async args => {
        /*const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt("Update <b>event</b> text", args.e.text());
        if (!modal.result) {
          return;
        }
        const e = args.e;
        e.data.text = modal.result;
        dp.events.update(e); */

        this.showDetails(args.e.data);
      },
      // onBeforeEventRender: args => {
      //   args.data.areas = [
      //     {
      //       right: 6,
      //       top: 6,
      //       width: 17,
      //       height: 17,
      //       image: "info-17-inverted-rounded-semi.svg",
      //       onClick: args => this.showDetails(args.source),
      //     },
      //   ];
      // },
      // onBeforeEventRender: args => {
      //   args.data.areas = [
      //     {
      //       right: 6,
      //       top: 6,
      //       width: 17,
      //       height: 17,
      //       image: "info-17-inverted-rounded-semi.svg",
      //       onClick: args => this.showDetails(args.source),
      //     },
      //   ];
      // },
      // onBeforeEventDomAdd: args => {
      //   args.element = (
      //     <div>
      //       {args.e.data.text}
      //       <div
      //         style={{ position: "absolute", right: "25px", top: "5px", height: "17px", width: "17px" }}
      //         onClick={() => this.showDetails(args.e)}
      //       >
      //         <img src={"info-17-semi.svg"} alt={"Info icon"} />
      //       </div>
      //     </div>
      //   );
      // },

      // bubble: new DayPilot.Bubble({
      //   onLoad: async args => {
      //     args.async = true;

      //     const { data } = await DayPilot.Http.get(`/bubble/${args.source.data.id}`);
      //     args.html = data;
      //     args.loaded();
      //   },
      // }),
    };
  }
  get calendar() {
    return this.calendarRef.current.control;
  }
  get datePicker() {
    return this.datePickerRef.current.control;
  }

  updateColor(e, color) {
    e.data.backColor = color;
    this.calendar.events.update(e);
  }
  showDetails(event) {
    console.log(event);
    this.setState({ open: true });
    this.setState({ modalEvent: event });
    console.log("view event", event);
  }

  loadGroups() {
    const data = [
      {
        name: "Schedule",
        id: "schedule",
        resources: this.state.columns,
      },
      {
        name: "Speakers",
        id: "speakers",
        resources: this.state.persons,
      },
      {
        name: "Tracks",
        id: "tracks",
        resources: this.state.tracks,
      },
    ];
    return data;
  }
  groupChanged(group) {
    const columns = group.resources;
    const events = [
      {
        id: 1,
        text: "Event 1",
        start: "2022-05-11T10:30:00",
        end: "2022-05-11T13:00:00",
        barColor: "#fcb711",
        resource: 0,
      },
      // ...
    ];

    this.calendar.update({ columns, events });
  }
  addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
  }

  loadEventsData() {
    var columns = [];
    var tracks = [];
    var types = [];
    var events = [];
    var persons = [];

    var days = this.state.schedule.conference.days;
    days.forEach((day, d) => {
      //console.log(day.rooms);
      for (const roomName in day.rooms) {
        console.log(roomName, day.rooms[roomName]);
        var personIndex = -1;
        var tracksIndex = -1;
        var typesIndex = -1;
        var resourceIndex = columns.findIndex(o => o.name === roomName);

        if (resourceIndex === -1) {
          columns.push({ name: roomName, id: columns.length, width: 200 });
          //resourceIndex = 1;
        }

        var ev = day.rooms[roomName];
        resourceIndex = columns.findIndex(o => o.name === roomName);
        // add event to schedule
        ev.forEach((et, ei) => {
          var startDate = new Date(et.date);
          var endDate = new Date(et.date);
          var durSplit = et.duration.split(":");

          startDate = this.addHours(-5, startDate);

          //startDate.addHours(startSplit[0], startSplit[1], 0);
          endDate.setHours(startDate.getHours() + parseInt(durSplit[0]));
          endDate.setMinutes(startDate.getMinutes() + parseInt(durSplit[1]));
          //console.log(startDate.toISOString(), "to", endDate.toISOString());

          var newEvent = {
            id: et.id,
            text: et.title,
            abstract: et.abstract,
            barColor: stringToColor(et.track),
            backColor: stringToColorFade(et.type),
            resource: resourceIndex,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            tags: et,
            toolTip: et.description,
            clickDisabled: true,
            borderColor: "#7b61ff",
            bubbleHtml: "", // <b></b>.
          };
          events.push(newEvent);

          et.persons.forEach((person, pi) => {
            personIndex = persons.findIndex(o => o.name === person.public_name);
            if (personIndex === -1) {
              persons.push({ name: person.public_name, id: persons.length, color: stringToColor(person.public_name) });
            }
          });
          tracksIndex = tracks.findIndex(o => o.name === et.track);
          if (tracksIndex === -1) {
            tracks.push({ name: et.track, id: tracks.length, color: newEvent.barColor });
          }
          typesIndex = types.findIndex(o => o.name === et.track);
          if (typesIndex === -1) {
            types.push({ name: et.type, id: types.length, color: newEvent.backColor });
          }
        });
      }
      /*
      day.rooms.forEach((room, i) => {
        if (columns.indexOf(o => o.name == room.name) === -1) {
          columns.push({ name: room.name, id: room.guid });
        }
      });*/
    });

    console.log("columns", columns);
    console.log("tracks", tracks);
    console.log("types", types);
    console.log("persons", persons);
    console.log("events", events);
    //this.setState({ columns: columns });
    this.setState({ columns: columns, events: events, tracks: tracks, persons: persons });
    this.calendar.update({ startDate: this.state.startDate, columns, events });

    //this.calendar.columnWidth = 200;
    //columnWidthSpec: "Auto",
  }

  async componentDidMount() {
    const result = await (await fetch("schedule.json")).json();
    this.setState({ schedule: result.schedule });

    /*
    this.datePicker = new DayPilot.DatePicker({
      target: this.dateRef.current,
      pattern: 'MMMM d, yyyy',
      date: "2022-09-07",
      onTimeRangeSelected: (args) => {
        this.setState({
          startDate: args.start
        });
      }
    });*/

    this.loadEventsData();
    this.downloadEvents();
  }
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
      this.setState({ yourEvents: json.events });
      //this.calendar.events.list.concat(json.events);
      var dp = this.calendar;
      if (json.events === undefined) {
        /*notification.warning({
          message: "No events",
          description: "There are no events loaded",
        });*/
        this.setState({ isBusy: false });
        return;
      }
      json.events.forEach((e, i) => {
        dp.events.add(e);
      });
      //this.calendar.update({ startDate: this.state.startDate, columns, events: json.events });

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
    this.setState({ isDirty: false });
  }
  changeDate() {
    this.datePicker.show();
  }
  async attendEvent(event) {
    //this.setState({ yourEvents: this.state.yourEvents.concat(event) });
    this.setState(prevState => ({ yourEvents: [...prevState.yourEvents, event] }));
    this.setState({ isDirty: true });
    this.setState({ open: !this.state.open });
  }

  render() {
    const { ...config } = this.state;
    var me = null;
    try {
      me = this.state.modalEvent.tags;
    } catch (err) {
      me = { links: [], persons: [] };
    }
    return (
      <>
        {this.state.isBusy && <Spin />}
        {this.state.isDirty && this.state.isBusy === false && (
          <>
            <Button onClick={async () => await this.uploadEvents(this.state.yourEvents)}>Save</Button>
          </>
        )}
        <Modal
          visible={this.state.open}
          title={<div>{me.title}</div>}
          onOk={() => {
            this.setState({ open: !this.state.open });
          }}
          onCancel={() => {
            this.setState({ open: !this.state.open });
          }}
          footer={
            <>
              {/* <Button onClick={()=>this.attendEvent(me)}>Attend</Button> */}
              <Button>Attend</Button>
            </>
          }
        >
          {me.description}
          <br />
          Room: <strong>{me.room}</strong>
          <br />
          Track: <strong>{me.track}</strong>
          <br />
          Date: <strong>{me.date}</strong>
          <br />
          Start: <strong>{me.start}</strong>
          <br />
          Duration: <strong>{me.duration}</strong>
          <br />
          Type: <strong>{me.type}</strong>
          <br />
          {me.persons &&
            me.persons.map((p, i) => {
              <>{p.public_name}&nbsp;</>;
            })}
        </Modal>

        <div style={{ display: "flex" }}>
          <DayPilotCalendar {...config} ref={this.calendarRef} viewType={this.state.viewType} />

          <div>
            {/* <ResourceGroups
              onChange={args => this.groupChanged(args.selected)}
              items={this.loadGroups()}
            ></ResourceGroups> */}
            <DayPilotNavigator
              selectMode={"Day"}
              showMonths={2}
              skipMonths={2}
              onTimeRangeSelected={args => {
                this.calendar.update({
                  startDate: args.day.value,
                });
                this.setState({ startDate: args.day.value });
                console.log(args);
              }}
              ref={this.datePickerRef}
            />
          </div>
        </div>
      </>
    );
  }
}

export default FDPCalendar;
