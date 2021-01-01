import { loginUser } from "./hash.js";

document.getElementById("theForm").addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    login();
  },
  false
);

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  let errorBox = document.getElementById("errorText");

  if (user.length > 0 && pass.length > 0) {
    loginUser(user, pass, errorBox);
  }
}
