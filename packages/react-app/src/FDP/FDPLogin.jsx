import { useState } from "react";
import { Input, Form, Button, notification, Card, Row, Spin } from "antd";
import { SettingOutlined, EditOutlined, EllipsisOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Transactor } from "../helpers";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import FDPCalendar from "./FDPCalendar";

//import { FdpStorage } from "@fairdatasociety/fdp-storage";
//import { FdpStorage } from "../fdp-storage/fdp-storage.ts";
//const FDP = require("@fairdatasociety/fdp-storage");

const host = "https://fairos.dev.fairdatasociety.org/";
const PODNAME = "agenda";

export default function FDPLogin({
  address,
  userSigner,
  setLogin,
  setUser,
  user,
  loggedIn,
  pods,
  setPods,
  files,
  setFiles,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [podExists, setPodExists] = useState(false);
  const [pod, setPod] = useState(null);
  const [dir, setDir] = useState("/");
  const [numItems, setNumItems] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [userData, setUserData] = useState({});

  const [data, setData] = useState({ hits: [] });
  const [form] = Form.useForm();

  const tx = Transactor(userSigner);

  async function onFinish(values) {
    //console.log("login", values);
    setPassword(values.password);
    setUsername(values.username);
  }

  async function doLogin(values) {
    try {
      var user = await (await userLogin(username, password)).json();
      console.log("user", user);
      user.username = username;
      user.password = password; // we will need this later
      setUserData(user);
      setUser(user);

      if (user.public_key) {
        notification.success({
          message: user.message,
          description: ``,
        });

        await setLogin(true);
        await isUserLoggedIn();
        await fetchPods();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Error: ${error.message}`,
      });
    }
  }
  useEffect(() => {
    doLogin();
  }, [username, password]);
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
  async function podOpen(podName) {
    var data = {
      pod_name: podName,
      password: password,
    };
    return fetch(host + "v1/pod/open" + "?" + new URLSearchParams(data), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
  }
  async function podNew(podName) {
    var data = {
      pod_name: podName,
      password: password,
    };
    var res = await fetch(host + "v1/pod/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    console.log(await res.json(), data);
    return res;
  }
  async function dirLs(podName, dirpath) {
    var data = {
      pod_name: podName,
      dir_path: dirpath, // "/"
    };
    return fetch(host + "v1/dir/ls" + "?" + new URLSearchParams(data), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }
  async function downloadFile(podName, dirPath, filename) {
    notification.info({
      message: "downloading...",
      description: podName + " " + dirPath + filename,
    });
    var data = {
      pod_name: podName,
      file_path: dirPath + filename, // "/index.json"
    };
    //debugger;
    var res = await fetch(host + "v1/file/download", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });
    console.log("download", res);
    await handleResponse(res);
  }
  async function handleResponse(response) {
    console.log(response);
    response.text().then(received_msg => {
      if (response.data instanceof Blob) {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(response.data);
        a.download = "file";
        a.click();
        return;
      }

      var data = JSON.parse(received_msg);
      if (data.event == "/file/download" && data.params["content_length"] != null) {
        console.log("Download file size", data.params["content_length"]);
      }
      console.log(data);
      notification.warning({
        message: "downloading...",
        description: data.message,
      });
    });
  }

  async function uploadFile(podName, dirPath, filename, object) {
    notification.info({
      message: "uploading...",
      description: podName + " " + dirPath + " " + filename,
    });

    const formData = new FormData();

    const stringify = JSON.stringify(object);
    const blob = new Blob([stringify], { type: "application/json" });
    const file = new File([blob], filename);

    formData.append("files", file);
    formData.set("pod_name", podName);
    formData.append("file_name", filename); //"index.json");
    formData.set("dir_path", dirPath); // "/");
    formData.set("block_size", "1Mb");

    var res = await fetch(host + "v1/file/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    var response = await res.json();

    try {
      notification.info({
        message: response.Responses[0].message,
        description: podName + " " + dirPath + " " + filename,
      });
      console.log("uploaded", await res.json());
    } catch (error) {
      notification.error({
        message: "Error",
        description: "uploading failed",
      });
    }
  }

  async function isUserLoggedIn() {
    var isLoggedIn = (await (await userLoggedIn()).json()).loggedin;
    console.log("isLoggedIn", isLoggedIn);
    notification.success({
      message: "logged in",
      description: isLoggedIn,
    });

    if (isLoggedIn !== undefined) setLogin(isLoggedIn);
  }
  async function fetchPods() {
    //setIsBusy(true);
    notification.info({
      message: "Getting pods",
      description: "please wait",
    });

    var podls = await (await podLs()).json();
    console.log("pods", podls);
    //for(var i = 0; i < podls.length; i++) {
    //  {}
    var hasPod = podls.pod_name.find(str => str === PODNAME);
    console.log("res", hasPod);
    if (hasPod === undefined) {
      // has no pod PODNAME
      await podNew(PODNAME);
      await fetchPods();
      return;
    }

    setPods(podls);
    notification.success({
      message: "got pods",
      description: podls.pod_name.length + " pods fetched",
    });

    //if (hasPod !== undefined) {
    await setPodExists(hasPod);
    await fetchOpenPod(PODNAME, hasPod === PODNAME); // open agenda
    //}
    // setIsBusy(false);
  }

  async function fetchOpenPod(podName, refreshDirLs) {
    notification.info({
      message: "opening...",
      description: podName,
    });
    setFiles({ files: [] });
    setIsBusy(true);

    var res = await (await podOpen(podName)).json();
    console.log("open pod", res);
    // notification.info({
    //   message: "opening..." + podName,
    //   description: res.message,
    // });
    if (res.message === "pod open: pod does not exist") {
      //"pod opened successfully" && res.message !== "pod open: pod already open") {
      notification.warning({
        message: "'" + podName + "' not found",
        description: "Creating new pod " + podName,
      });
      await podNew(podName);
      await podOpen(podName);
      await fetchPods();
    } else {
      notification.success({
        message: podName,
        description: res.message,
      });
      await setPod(podName);
      await setDir("/");

      if (refreshDirLs === true) await fetchDirLs(podName, dir);
    }
    setIsBusy(false);
  }

  async function fetchDirLs(podName, dirpath) {
    setIsBusy(true);
    setFiles({ files: [] });
    notification.info({
      message: "listing...",
      description: podName + " " + dirpath,
    });

    var res = await (await dirLs(podName, dirpath)).json();
    console.log("dirLs", res);
    if (res.message === "ls: pod not open") {
      await fetchOpenPod(podName);
      notification.error({
        message: podName + " " + dirpath,
        description: "ls: pod not open",
      });
      return;
    }
    notification.success({
      message: podName + " " + dirpath,
      description: "Contains " + (res.files === undefined ? "0" : res.files.length) + " items",
    });
    setPod(podName);
    setFiles(res.files);
    setNumItems(res.files.length);
    setIsBusy(false);
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

  try {
    var areFilesValid = false;
    if (Object.prototype.toString.call(files) === "[object Array]") {
      //console.log("Array!");
      areFilesValid = true;
    }
    //console.log("files", files);
  } catch (error) {
    //console.log(error);
  }
  if (loggedIn === true && user != null /*&& pods !== undefined*/) {
    return (
      <div>
        {podExists === null && (
          <>
            <Button onClick={async () => await podNew(PODNAME)}>Create pod {PODNAME}</Button>
            <br />
          </>
        )}
        <div style={{ display: "flex", margin: "20px" }}>
          <div style={{ textAlign: "left", width: "20%" }}>
            <h2>Pods {isBusy && <Spin size="small" />}</h2>
            {pods.pod_name.map(p => (
              <>
                <span key={p} style={{ cursor: "pointer" }}>
                  {pod === p ? (
                    <strong
                      onClick={async () => {
                        //await fetchOpenPod(p);
                        //await fetchDirLs(p, dir);
                        await fetchOpenPod(p, true);
                      }}
                    >
                      {p}
                    </strong>
                  ) : (
                    <span
                      onClick={async () => {
                        await fetchOpenPod(p, true);
                      }}
                    >
                      {p}
                    </span>
                  )}
                </span>
                <br />
              </>
            ))}
          </div>
          <div style={{ textAlign: "left", width: "80%" }}>
            <h2>{dir} &nbsp;</h2>
            <Row>
              {areFilesValid &&
                files.map(f => (
                  <Card
                    key={f.name}
                    className="flexible-card"
                    style={{ display: "flex", flexDirection: "column" }}
                    actions={[
                      // <SettingOutlined key="setting" />,
                      // <EditOutlined key="edit" />,
                      // <EllipsisOutlined key="ellipsis" />,
                      // <DeleteOutlined />,
                      <DownloadOutlined
                        key="download"
                        onClick={async () => {
                          return await downloadFile(pod, dir, f.name);
                        }}
                      />,
                    ]}
                  >
                    {f.creation_time}
                    <Card.Meta title={f.name} description={f.content_type} />
                  </Card>
                  // <Card>
                  //   <span key={f} style={{ cursor: "pointer" }}>
                  //     {f.name}
                  //   </span>
                  // </Card>
                ))}
              {isBusy && <Spin size="large" />}
            </Row>
            <Row>{numItems} Items</Row>
            <span
              onClick={async () => await uploadFile(pod, dir, "events.0.json", { events: [] })}
              style={{ cursor: "pointer" }}
            >
              Events 0
            </span>
          </div>
        </div>
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

      <div>
        <br />
        <br />
        <span>Running on the testnet.</span>
        <br />
        <br />
        Developed by&nbsp;
        <Link to={{ pathname: "https://datafund.io" }} target="_blank" rel="noopener noreferrer">
          Datafund.io
        </Link>
        &nbsp;for&nbsp;
        <Link to={{ pathname: "https://github.com/fairDataSociety/" }} target="_blank" rel="noopener noreferrer">
          Fair Data Society
        </Link>
        .<br />
        Powered by{" "}
        <Link to={{ pathname: "https://http://fairdataprotocol.bzz.link/" }} target="_blank" rel="noopener noreferrer">
          Fair Data Protocol
        </Link>
      </div>
    </div>
  );

  // TODO: add disclaimer from create account page data will be lost
  // developed by datafund.io for fairdatasociety.org
  // link na datafund
  // link na fairdatasociety
  // link na github
  // header link na github
  // powered by fairdataprotocol.bzz.link
}
