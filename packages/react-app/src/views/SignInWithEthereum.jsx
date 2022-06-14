import React from "react";
import { getLoggedInStatus } from "../helpers/siweBackendHandlers";
const highlight = {
  marginLeft: 4,
  marginRight: 8,
  /* backgroundColor: "#f9f9f9", */ padding: 4,
  borderRadius: 4,
  fontWeight: "bolder",
};

export default function SignInWithEthereum() {
  return (
    <>
      <div style={{ margin: "auto", marginTop: 32 }}>
        What is{" "}
        <a href="https://login.xyz/" target="_blank" rel="noopener noreferrer">
          Sign-In with Ethereum
        </a>
        {"? And "}
        <a
          href="https://blog.spruceid.com/sign-in-with-ethereum-is-a-game-changer-part-1/"
          target="_blank"
          rel="noopener noreferrer"
        >
          why is it a game changer?
        </a>{" "}
      </div>
      <div style={{ margin: "auto", marginTop: 32 }}>
        Here, we show how to create a simple backend API that implements Sign-In with Ethereum with{" "}
        <a
          href="https://blog.spruceid.com/sign-in-with-ethereum-is-a-game-changer-part-1/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Express.js
        </a>{" "}
        and{" "}
        <a href="https://blockin.vercel.app" target="_blank" rel="noopener noreferrer">
          Blockin
        </a>
        .
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📡</span>
        Start a local backend server by running
        <span className="highlight" style={highlight}>
          yarn run-node-backend
        </span>{" "}
        in another terminal.
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        Set{" "}
        <span className="highlight" style={highlight}>
          USE_SIGN_IN_WITH_ETHEREUM
        </span>{" "}
        in{" "}
        <span className="highlight" style={highlight}>
          App.jsx
        </span>{" "}
        to{" "}
        <span className="highlight" style={highlight}>
          true
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🔭</span>
        Make sure your frontend and backend are pointing at each other:
        <span className="highlight" style={highlight}>
          BACKEND_URL
        </span>{" "}
        in{" "}
        <span className="highlight" style={highlight}>
          constants.js
        </span>{" "}
        and the CORS origin in{" "}
        <span className="highlight" style={highlight}>
          node-backend/app.js
        </span>
        .
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚀</span>
        Your site should now support Sign-In With Ethereum! Try clicking{" "}
        <button
          onClick={async () => {
            try {
              const loggedIn = await getLoggedInStatus();

              if (loggedIn) {
                alert("Success! You are authenticated!");
              } else {
                alert("Unauthenticated! Your access request has been denied.");
              }
            } catch (e) {
              alert(e);
            }
          }}
        >
          this button
        </button>{" "}
        before and after signing in at the top right!
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>⚙️</span>
        Although everything works, to be production ready, you must eventually implement{" "}
        <span className="highlight" style={highlight}>
          generateNonce
        </span>{" "}
        and{" "}
        <span className="highlight" style={highlight}>
          verifyNonce
        </span>{" "}
        in{" "}
        <span className="highlight" style={highlight}>
          node-backend/routes/nonceHandlers
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🎛</span>
        You can further configure and customize the backend at{" "}
        <span className="highlight" style={highlight}>
          node-backend
        </span>{" "}
        and your frontend at{" "}
        <span className="highlight" style={highlight}>
          Account.jsx
        </span>{" "}
        (
        <a href="https://blockin.gitbook.io/blockin/" target="_blank" rel="noopener noreferrer">
          learn more here
        </a>
        )
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🖍️</span>
        Learn more about Blockin and Sign-In with Ethereum by visiting{" "}
        <a href="https://blockin.gitbook.io/blockin/" target="_blank" rel="noopener noreferrer">
          the Blockin docs
        </a>
      </div>
    </>
  );
}
