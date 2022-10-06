import { useState } from "react";
import { Input, Form, Button, notification } from "antd";
import { Transactor } from "../helpers";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { useEffect } from "react";
import FDPCalendar from "./FDPCalendar";

const UserSignup = "/user/signup";
const UserLogin = "/user/login";
const UserImport = "/user/import";
const UserPresent = "/user/present";
const UserIsLoggedin = "/user/isloggedin";
const UserLogout = "/user/logout";
const UserExport = "/user/export";
const UserDelete = "/user/delete";
const UserStat = "/user/stat";
const PodNew = "/pod/new";
const PodOpen = "/pod/open";
const PodClose = "/pod/close";
const PodSync = "/pod/sync";
const PodDelete = "/pod/delete";
const PodLs = "/pod/ls";
const PodStat = "/pod/stat";
const PodShare = "/pod/share";
const PodReceive = "/pod/receive";
const PodReceiveInfo = "/pod/receiveinfo";
const DirIsPresent = "/dir/present";
const DirMkdir = "/dir/mkdir";
const DirRmdir = "/dir/rmdir";
const DirLs = "/dir/ls";
const DirStat = "/dir/stat";
const FileDownload = "/file/download";
const FileUpload = "/file/upload";
const FileUploadStream = "/file/upload/stream";
const FileShare = "/file/share";
const FileReceive = "/file/receive";
const FileReceiveInfo = "/file/receiveinfo";
const FileDelete = "/file/delete";
const FileStat = "/file/stat";
const KVCreate = "/kv/new";
const KVList = "/kv/ls";
const KVOpen = "/kv/open";
const KVDelete = "/kv/delete";
const KVCount = "/kv/count";
const KVEntryPut = "/kv/entry/put";
const KVEntryGet = "/kv/entry/get";
const KVEntryDelete = "/kv/entry/del";
const KVLoadCSV = "/kv/loadcsv";
const KVSeek = "/kv/seek";
const KVSeekNext = "/kv/seek/next";
const DocCreate = "/doc/new";
const DocList = "/doc/ls";
const DocOpen = "/doc/open";
const DocCount = "/doc/count";
const DocDelete = "/doc/delete";
const DocFind = "/doc/find";
const DocEntryPut = "/doc/entry/put";
const DocEntryGet = "/doc/entry/get";
const DocEntryDel = "/doc/entry/del";
const DocLoadJson = "/doc/loadjson";
const DocIndexJson = "/doc/indexjson";

//import { FdpStorage } from "@fairdatasociety/fdp-storage";
//import { FdpStorage } from "../fdp-storage/fdp-storage.ts";
//const FDP = require("@fairdatasociety/fdp-storage");

const host = "https://fairos.dev.fairdatasociety.org/";

export default function FDPLogin({ address, userSigner, setLogin, setUser, user, loggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pods, setPods] = useState([]);

  const [data, setData] = useState({ hits: [] });
  const [form] = Form.useForm();

  const tx = Transactor(userSigner);
  /*
  var ws = new WebSocket("wss://fairos.dev.fairdatasociety.org/ws/v1/");

  ws.onopen = () => {
    console.log("open ws");
  };
  ws.onclose = function () {
    console.log("closed ws");
  };
  ws.onmessage = function (evt) {
    var received_msg = evt.data;
    console.log("onmessage", evt);
    if (evt.data instanceof Blob) {
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(evt.data);
      a.download = "file";
      a.click();
      return;
    }

    var data = JSON.parse(received_msg);
    if (data.event == FileDownload && data.params["content_length"] != null) {
      console.log("Download file size", data.params["content_length"]);
    }
    console.log(data);
  };
  */

  //var fdp = new FdpStorage({ options: ensOptions });
  //fdp.ens = new mainnetENSproxy(address);
  //fdp.createAccount(username, password);
  //fdp.connection.bee = new Bee(newUrl);

  async function onFinish(values) {
    //console.log("login", values);
    setPassword(values.password);
    setUsername(values.username);

    /*try {
      await wsUserLogin();
    } catch (error) {
      console.log("wsUserLogin", error);
    }*/

    try {
      var user = await (await userLogin(values.username, values.password)).json();
      console.log("user", user);
      setUserData(user);
      setUser(user);

      notification.open({
        message: user.message,
        description: ``,
      });

      if (user.public_key) {
        await fetchPods();
        await setLogin(true);
        await isUserLoggedIn();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Error: ${error.message}`,
      });
    }
  }
  /*
  async function wsUserLogin() {
    var data = {
      event: UserLogin,
      params: {
        user_name: username,
        password: password,
      },
    };
    ws.send(JSON.stringify(data));
  }*/

  async function userLogin(user, pass) {
    var data = {
      user_name: user,
      password: pass,
    };
    return await fetch(host + "v2/user/login", {
      method: "POST",
      //mode: "no-cors",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Origin": "http://glup.fairdatasociety.org:3000/",
        // "Access-Control-Allow-Credentials": "true",
        // "Access-Control-Allow-Headers": "Content-Type",
        // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        // Origin: "http://glup.fairdatasocety.org:3000/",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    //ws.send(JSON.stringify(data));
  }
  async function userLoggedIn() {
    var data = {
      user_name: username,
    };
    return await fetch(host + "v1/user/isloggedin" + "?" + new URLSearchParams(data), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }
  async function podLs() {
    var data = {
      pod_name: "",
      password: password,
    };
    return fetch(host + "v1/pod/ls" + "?" + new URLSearchParams(data), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  async function isUserLoggedIn() {
    var isLoggedIn = (await (await userLoggedIn()).json()).loggedin;
    console.log("isLoggedIn", isLoggedIn);
    notification.open({
      message: "logged in",
      description: isLoggedIn,
    });

    if (isLoggedIn !== undefined) setLogin(isLoggedIn);
  }
  async function fetchPods() {
    var podls = await (await podLs()).json();
    console.log("pods", podls);
    setPods(podls);
    notification.open({
      message: "pods fetched:",
      description: podls.pod_name.length,
    });
    //setLogin(isLoggedIn);
  }

  /*useEffect(() => {
    fetchPods();
  }, [isLoggedIn]);*/

  //useEffect(() => {}, [pods]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 12,
        offset: 8,
      },
    },
  };
  if (loggedIn === true /*&& pods !== undefined*/) {
    return (
      <div>
        <h1>Logged in</h1>
        <h2>Pods</h2>
        <ul>
          {pods.pod_name.map(pod => (
            <li key={pod}>{pod}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <br />
      {loggedIn && (
        <>
          <h1>Fair Data Society Calendar</h1>
          <FDPCalendar />
        </>
      )}

      <Form
        {...formItemLayout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        initialValues={{ username: "", password: "" }}
      >
        <h1>Fair Data Society Login</h1>
        <Form.Item label="Username" name="username">
          <Input placeholder={username} />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password placeholder={password} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {"Login"}
          </Button>
        </Form.Item>
      </Form>

      <br />
      <h3>Don't have account ?</h3>
      <Link to={{ pathname: "https://create.dev.fairdatasociety.org" }} target="_blank" rel="noopener noreferrer">
        Create Account
      </Link>
    </div>
  );
}
