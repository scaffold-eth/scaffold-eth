import { useState } from "react";
import { Input, Form, Button } from "antd";
import { Transactor } from "../helpers";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { useEffect } from "react";

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

export default function FDPLogin({ address, userSigner }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({ hits: [] });
  const [form] = Form.useForm();

  const tx = Transactor(userSigner);
  var ws = new WebSocket("ws://fairos.dev.fairdatasociety.org/ws/v1/");

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

  //var fdp = new FdpStorage({ options: ensOptions });
  //fdp.ens = new mainnetENSproxy(address);
  //fdp.createAccount(username, password);
  //fdp.connection.bee = new Bee(newUrl);

  //use effect and fetch from https://devconagenda.bzz.link/schedule/export/schedule.json to get the data
  useEffect(() => {
    // async function fetchSchedule() {
    //   console.log("fetching schedule");
    //   const result = await (await fetch("schedule.json")).json();
    //   //setSchedule(result);
    //   console.log("schedule fetched", result);
    // }
    // fetchSchedule();
  }, []);

  async function onFinish(values) {
    console.log("login", values);
    setPassword(values.password);
    setUsername(values.username);

    try {
      await wsUserLogin();
    } catch (error) {
      console.log("wsUserLogin", error);
    }

    try {
      var user = await userLogin();
      //wsUserLogin(user);
      console.log("user", user);
    } catch (error) {
      console.log("userLogin", error);
    }
  }
  async function wsUserLogin() {
    var data = {
      event: UserLogin,
      params: {
        user_name: username,
        password: password,
      },
    };
    ws.send(JSON.stringify(data));
  }

  async function userLogin() {
    var data = {
      user_name: username,
      password: password,
    };
    return await fetch(host + "v2/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    //ws.send(JSON.stringify(data));
  }
  async function userLoggedin() {
    var data = {
      user_name: username,
    };
    return await fetch(host + "/user/isloggedin" + "?" + new URLSearchParams(data), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

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

  return (
    <div>
      <br />

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
