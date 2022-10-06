import React, { Component } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import { ResourceGroups } from "./ResourceGroups";
var stringToColor = function (str) {
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
    this.state = {
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

      onHeaderClick: async args => {
        const modal = await DayPilot.Modal.prompt("Resource name:", args.column.name);
        if (!modal.result) {
          return;
        }
        args.column.data.name = modal.result;
        this.calendar.update();
      },
      onTimeRangeSelected: async args => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        console.log(dp.events, args);
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
        });
        this.setState({ events: dp.events.list });
      },
      onEventClick: async args => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt("Update <b>event</b> text", args.e.text());
        if (!modal.result) {
          return;
        }
        const e = args.e;
        e.data.text = modal.result;
        dp.events.update(e);
      },
      onBeforeEventRender: args => {
        args.data.areas = [
          {
            right: 6,
            top: 6,
            width: 17,
            height: 17,
            image: "info-17-inverted-rounded-semi.svg",
            onClick: args => this.showDetails(args.source),
          },
        ];
      },
      onBeforeEventRender: args => {
        /*args.data.backColor = "#93c47d";
        args.data.barHidden = true;
        args.data.fontColor = "white";
        args.data.borderColor = "darker";*/

        args.data.areas = [
          {
            right: 6,
            top: 6,
            width: 17,
            height: 17,
            image: "info-17-inverted-rounded-semi.svg",
            onClick: args => this.showDetails(args.source),
          },
        ];
      },
      onBeforeEventDomAdd: args => {
        args.element = (
          <div>
            {args.e.data.text}
            <div
              style={{ position: "absolute", right: "25px", top: "5px", height: "17px", width: "17px" }}
              onClick={() => this.showDetails(args.e)}
            >
              <img src={"info-17-semi.svg"} alt={"Info icon"} />
            </div>
          </div>
        );
      },

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
        const resourceIndex = columns.findIndex(o => o.name === roomName);
        var personIndex = -1;
        var tracksIndex = -1;
        var typesIndex = -1;

        if (resourceIndex === -1) {
          columns.push({ name: roomName, id: columns.length });
        }

        var ev = day.rooms[roomName];
        // add event to schedule
        ev.forEach((et, ei) => {
          var startDate = new Date(et.date);
          var endDate = new Date(et.date);
          var durSplit = et.duration.split(":");

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
            bubbleHtml: "Static 'Event 1' details specified using event <b>data object</b>.",
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
  }

  async componentDidMount() {
    const result = await (await fetch("schedule.json")).json();
    this.setState({ schedule: result.schedule });

    this.loadEventsData();
  }

  render() {
    const { ...config } = this.state;
    return (
      <>
        <div style={{ display: "flex" }}>
          <DayPilotCalendar {...config} ref={this.calendarRef} viewType={this.state.viewType} />

          <div>
            <ResourceGroups
              onChange={args => this.groupChanged(args.selected)}
              items={this.loadGroups()}
            ></ResourceGroups>
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
