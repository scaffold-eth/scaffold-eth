export async function userLogin(host, user, pass) {
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
}

export async function userLoggedIn(host, username) {
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

export async function podLs(host, password) {
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

export async function dirLs(host, podName, dirpath) {
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

export async function podOpen(host, podName, password) {
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

export async function podNew(host, podName, password) {
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
