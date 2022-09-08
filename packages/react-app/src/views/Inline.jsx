import React from "react";
import { InlineLaunch } from "@relaycc/receiver";

export default function Inline() {
  const people = [
    {
      title: "Austin Griffith",
      address: "0x34aa3f359a9d614239015126635ce7732c18fdf3",
    },
    {
      title: "Peter Denton",
      address: "0x6a03c07f9cb413ce77f398b00c2053bd794eca1a",
    },
    {
      title: "Relay",
      address: "0x45c9a201e2937608905fef17de9a67f25f9f98e0",
    },
  ];

  return (
    <div>
      <h1>Inline version of receiver</h1>
      <p>
        The purpose of the Inline version of Receiver is if you want the link to open Receiver somewhere else on the
        page besides the bottom right corner. A common example is when you have a list of names and you want an icon
        next to each of their names so users of your site can click on the icon to open a chat window with that specific
        person.
      </p>
      <p>To implement the Inline version, import InlineLaunch from @relaycc/receiver as shown below.</p>
      <p>
        To get the inline version working as expected, pass a prop called inlineLaunch and set it to true. You are also
        going to pass the peerAddress prop and set it to the address of the person who you want the chat to open up to
        when clicked.{" "}
      </p>

      <InlineLaunch inlineLaunch={true} peerAddress={"0x34aa3f359a9d614239015126635ce7732c18fdf3"} />

      <InlineLaunch inlineLaunch={true} peerAddress={"0x6a03c07f9cb413ce77f398b00c2053bd794eca1a"} />
      {people.map(e => (
        <div>
          <span>{e.title}</span>
          <InlineLaunch inlineLaunch={true} peerAddress={e.address} />
        </div>
      ))}
    </div>
  );
}
