function registerUser(username, password, errorBox, infoBox) {
  let request = new XMLHttpRequest();
  let name = username;
  let pass = CryptoJS.MD5(password + name);
  request.open("POST", "/register", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`name=${name}&password=${pass}`);
  request.onreadystatechange = function () {
    infoBox.innerText = "";
    if (request.status == 409) {
      errorBox.innerText = "Username taken!";
    } else if (request.status == 500) {
      errorBox.innerText = "Error occured!";
    } else if (request.status == 201) {
      infoBox.innerText = "Created user";
      errorBox.innerText = "";
      return;
    } else {
      errorBox.innerText = "Unknown error";
    }
  };
}

function loginUser(username, password, errorBox) {
  let errorArea = errorBox;
  let request = new XMLHttpRequest();
  let name = username;
  let pass = CryptoJS.MD5(password + name);
  request.open("POST", "/login", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`name=${name}&password=${pass}`);
  request.onreadystatechange = function () {
    // This is ugly and I want to change it
    let urlToLogin =
      window.location.protocol + "//" + window.location.host + "/login";
    if (request.responseURL == urlToLogin) {
      errorArea.innerText = "Username or Password is incorrect";
    } else {
      window.location = "/auth";
    }
  };
}

export { registerUser, loginUser };
