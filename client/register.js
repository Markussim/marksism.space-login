import { registerUser } from "./hash.js";

function regUsrOnSubmit() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("passwordConfirm").value;

  try {
    if (pass == confirm) registerUser(user, pass);
  } catch (error) {
    alert(error);
  }
}
