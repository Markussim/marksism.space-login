const express = require("express");
const dBModule = require("./dbModule.js");
const User = require("./models/user.js");
const fs = require("fs");
const session = require("express-session");
const sessionstore = require("sessionstore");
const passport = require("passport");
const app = express();
const port = 3000;

let store;
connectToMongo("marksism-login");

app.use(express.static("client"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    secret: "keyboard cat",
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

const initializePassport = require("./config/passport.js");
initializePassport(
  passport,
  (name) => User.find((user) => user.name === name),
  (id) => User.find((user) => user.id === id)
);

app.post("/register", async (req, res) => {
  try {
    const userExist = await dBModule.findInDBOne(User, req.body.name);
    console.log(req.body.password);
    if (userExist == null) {
      dBModule.saveToDB(createUser(req.body.name, req.body.password));
      res.sendStatus(201);
      console.log("Got here");
    } else {
      res.sendStatus(409);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/auth", checkAuthenticated, (req, res) => {
  res.send("You're authenticated");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/client/register.html");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/client/login.html");
});

function connectToMongo(dbName) {
  if (fs.existsSync("mongoauth.json")) {
    const mongAuth = require("./mongoauth.json");
    dBModule.cnctDBAuth(dbName);
    store = sessionstore.createSessionStore({
      type: "mongodb",
      authSource: "admin",
      username: mongAuth.username,
      password: mongAuth.pass,
    });
  } else {
    dBModule.cnctDB(dbName);
    store = sessionstore.createSessionStore({ type: "mongodb" });
  }
}

function createUser(nameIN, passIN) {
  return new User({
    name: nameIN,
    password: passIN,
  });
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/auth");
  }
  next();
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
