import { registerUser } from "./hash.js";

function regUsrOnSubmit() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("passwordConfirm").value;
  let errorBox = document.getElementById("errorText");

  try {
    if (pass == confirm && user.length > 0 && pass.length > 0) {
      registerUser(user, pass, errorBox, document.getElementById("infoText"));
    } else if (user.length == 0) {
      errorBox.innerText = "Please pick a name";
    } else if (pass.length == 0) {
      errorBox.innerText = "Please pick a password";
    } else if (pass != confirm) {
      errorBox.innerText = "Password does not match";
    } else {
      errorBox.innerText = "Unknown client error";
    }
  } catch (error) {
    alert(error);
  }
}

document.getElementById("theForm").addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    regUsrOnSubmit();
  },
  false
);
