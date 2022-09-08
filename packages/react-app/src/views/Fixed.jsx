import React from "react";
import wholepage from "../images/wholepage.png";
import importing from "../images/importing.png";

export default function Fixed() {
  return (
    <div>
      <h1>How to implement Intercom on your website</h1>
      <p>yarn add @relaycc/receiver</p>
      <p>
        Now that receiver is installed, open up your Index.jsx file and import Receiver and FixedLaunch from
        '@relaycc/receiver' into your project{" "}
      </p>
      <img src={importing} alt="importing Receiver and Fixed Launch from @relaycc/receiver" />
      <p>
        Next, wrap your entire app and the Fixed Launch component with the Receiver component in your main directory.
        The FixedLaunch component takes a prop called peerAddress. This is where you put in a wallet address for the
        user to initially send messages to when the app is opened. Usually a site admin wallet address etc...{" "}
      </p>
      <p>Now your index.js file should look like this</p>
      <p>
        The reason we wrap the entire app with Receiver is so the user has access to receiver while navigating the site.
        If you want Receiver only available on a certain page, wrap that page with Receiver instead of the entire app.
      </p>
      <img src={wholepage} alt="wrapping the fixed launch component with the receiver component" />
      <p></p>
    </div>
  );
}
