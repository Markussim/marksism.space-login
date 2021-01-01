function registerUser(username, password, errorBox) {
  let request = new XMLHttpRequest();
  let name = username;
  let pass = CryptoJS.MD5(password + name);
  request.open("POST", "/register", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`name=${name}&password=${pass}`);
  request.onreadystatechange = function () {
    if (request.status == 409) {
      errorBox.innerText = "Username taken!";
    } else if (request.status == 500) {
      errorBox.innerText = "Error occured!";
    } else if (request.status == 201) {
      return;
    } else {
      errorBox.innerText = "Unknown error";
    }
  };
}

export { registerUser };
