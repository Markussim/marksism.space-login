function registerUser(username, password) {
  let request = new XMLHttpRequest();
  let name = username;
  let pass = CryptoJS.MD5(password + name);
  request.open("POST", "/register", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`name=${name}&password=${pass}`);
  request.onreadystatechange = function () {
    if (request.status == 409) {
      throw "Username taken!";
    } else if (request.status == 500) {
      throw "Error occured!";
    } else if (request.status == 201) {
      return;
    }
  };
}

export { registerUser };
