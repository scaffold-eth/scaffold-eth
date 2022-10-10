import { useState } from "react";
import { Input, Form, Button, notification, Card, Row, Spin } from "antd";
import { SettingOutlined, EditOutlined, EllipsisOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Transactor } from "../helpers";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import FDPCalendar from "./FDPCalendar";
import * as FairOS from "./FairOS.js";

//import { FdpStorage } from "@fairdatasociety/fdp-storage";
//import { FdpStorage } from "../fdp-storage/fdp-storage.ts";
//const FDP = require("@fairdatasociety/fdp-storage");

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
  pod,
  setPod,
  dir,
  setDir,
}) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [podExists, setPodExists] = useState(false);
  const [numItems, setNumItems] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [form] = Form.useForm();

  //const tx = Transactor(userSigner);

  async function onFinish(values) {
    setPassword(values.password);
    setUsername(values.username);
  }

  async function doLogin() {
    try {
      //console.log("doLogin", username, password, user);
      if (username === null || password === null || username === undefined || password === undefined) return;
      var user = await (await FairOS.userLogin(FairOS.fairOShost, username, password)).json();
      console.log("user", user);

      user.username = username;
      user.password = password; // we will need this later
      setUser(user);

      if (user.public_key) {
        notification.success({
          message: user.message,
          description: ``,
        });

        await setLogin(true);
        await isUserLoggedIn();
        await fetchPods();
      } else {
        notification.error({
          message: user.message,
          description: `xxx`,
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: `Error: ${error.message}`,
      });
    }
  }
  useEffect(() => {
    doLogin();
  }, [username, password]);

  async function downloadFile(podName, dirPath, filename) {
    notification.info({
      message: "downloading...",
      description: podName + " " + dirPath + filename,
    });
    var res = await FairOS.downloadFile(FairOS.fairOShost, podName, dirPath, filename);
    await handleResponse(res, filename); // will download the file in browser
  }
  async function handleResponse(response, filename) {
    console.log(response);
    var arrayBuffer = await response.arrayBuffer();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([arrayBuffer]));
    a.download = filename;
    a.click();
    /*
    response.arrayBuffer().then(received_msg => {
      if (response.data instanceof Blob) {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(response.data);
        a.download = "file";
        a.click();
        return;
      }

      var data = JSON.parse(received_msg);
      if (data.params["content_length"] != null) {
        console.log("Download file size", data.params["content_length"]);
      }
      console.log(data);
      notification.warning({
        message: "downloading...",
        description: data.message,
      });
    }); */
  }

  async function uploadFile(podName, dirPath, filename, object) {
    notification.info({
      message: "uploading...",
      description: podName + " " + dirPath + " " + filename,
    });

    var res = await FairOS.uploadObjectAsFile(FairOS.fairOShost, podName, dirPath, filename, object);
    var response = await res.json();

    try {
      notification.info({
        message: response.Responses[0].message,
        description: podName + " " + dirPath + " " + filename,
      });
      //console.log("uploaded", await res.json());
    } catch (error) {
      notification.error({
        message: "Error uploading failed",
        description: "uploading failed",
      });
    }
  }

  async function isUserLoggedIn() {
    var isLoggedIn = (await (await FairOS.userLoggedIn(FairOS.fairOShost, username)).json()).loggedin;
    /*notification.success({
      message: "logged in",
      description: isLoggedIn,
    });*/

    if (isLoggedIn !== undefined) setLogin(isLoggedIn);
  }
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function fetchPods() {
    // notification.info({
    //   message: "Getting pods",
    //   description: "please wait",
    // });
    var pass = user === null ? password : user.password;

    var podls = await (await FairOS.podLs(FairOS.fairOShost, pass)).json();
    console.log("pods", podls);
    var hasPod = podls.pod_name.find(str => str === PODNAME);
    if (hasPod === undefined) {
      //await FairOS.podNew(FairOS.fairOShost, PODNAME, user.password);
      //await delay(30000); // wait 10s
      //podls = await (await FairOS.podLs(FairOS.fairOShost, user.password)).json();
      //hasPod = podls.pod_name.find(str => str === PODNAME); // retry to get, not best solution but avoids endless loop
      //await fetchPods();
      //return;
      notification.info({
        message: "Agenda",
        description: "does not exist, create it",
      });
      setPodExists(null);
      setPods(podls);
      return;
    }

    setPods(podls);
    notification.success({
      message: "got pods",
      description: podls.pod_name.length + " pods fetched",
    });

    await setPodExists(hasPod);
    await fetchOpenPod(PODNAME, hasPod === PODNAME); // open agenda
  }

  async function fetchOpenPod(podName, refreshDirLs) {
    notification.info({
      message: "opening...",
      description: podName,
    });
    setFiles({ files: [] });
    setIsBusy(true);

    var pass = user === null ? password : user.password;
    var res = await (await FairOS.podOpen(FairOS.fairOShost, podName, pass)).json();
    console.log("open pod", res);
    if (res.message === "pod open: pod does not exist") {
      notification.warning({
        message: "'" + podName + "' not found",
        description: "Create pod " + podName,
      });
      //await FairOS.podNew(FairOS.fairOShost, podName, user.password);
      //await FairOS.podOpen(FairOS.fairOShost, podName, user.password);
      //await fetchPods();
    } else {
      notification.success({
        message: podName,
        description: res.message,
      });
      await setPod(podName);
      await setDir("/");

      if (refreshDirLs === true) await fetchDirLs(podName, dir); // this is so wrong
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

    var res = await (await FairOS.dirLs(FairOS.fairOShost, podName, dirpath)).json();
    console.log("dirLs", res);
    if (res.message === "ls: pod not open") {
      await fetchOpenPod(podName);
      notification.error({
        message: podName + " " + dirpath,
        description: "ls: pod not open",
      });
      setIsBusy(false);
      return;
    }
    notification.success({
      message: podName + " " + dirpath,
      description: "Contains " + (res.files === undefined ? "0" : res.files.length) + " items",
    });

    setPod(podName);
    if (res.files === undefined) {
      res.files = [];
    }

    setFiles(res.files);
    setNumItems(res.files.length);
    setIsBusy(false);
  }
  async function createAgendaPod() {
    await FairOS.podNew(FairOS.fairOShost, PODNAME, user.password);
    await delay(1000); // wait 10s
    await fetchPods();
  }

  async function deletePod(podName) {
    notification.info({
      message: "deleting " + podName,
    });
    await FairOS.podDelete(FairOS.fairOShost, podName, user.password);
    await delay(10000); // wait 10s
    await fetchPods();
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
      areFilesValid = true;
    }
  } catch (error) {
    console.error(error);
  }
  if (loggedIn === true && user != null /*&& pods !== undefined*/) {
    return (
      <div>
        <div style={{ display: "flex", margin: "20px" }}>
          <div style={{ textAlign: "left", width: "20%" }}>
            <h2>Pods {isBusy && <Spin size="small" />}</h2>
            {pods.pod_name.map(p => (
              <span key={p}>
                <span style={{ cursor: "pointer" }}>
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
              </span>
            ))}
            <br />

            <div className={"toolbar"}>
              {podExists === null && (
                <>
                  <Button onClick={async () => await createAgendaPod()}>Create {PODNAME}</Button>
                </>
              )}
              {pod && (
                <>
                  <Button onClick={async () => await deletePod(pod)}>Delete {pod}</Button>
                </>
              )}
            </div>
          </div>
          <div style={{ textAlign: "left", width: "80%" }}>
            <h2>{dir} &nbsp;</h2>
            <Row>
              {areFilesValid &&
                files.map(f => (
                  <Card
                    key={f}
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
                    {new Date(f.creation_time * 1000).toISOString()}
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
        <h1>Log in Fair Data Society Account</h1>
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
        <span>Running on the testnet. Data will be lost.</span>
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
