const mongoose = require("mongoose"),
  ObjectID = require("mongodb").ObjectID;
let db;

//Connect to MongoDB With Authentication.
exports.cnctDBAuth = (collectionname) => {
  const mongAuth = require("./mongoauth.json");
  mongoose.connect("mongodb://localhost:27017/" + collectionname, {
    auth: {
      authSource: "admin",
    },
    user: mongAuth.username,
    pass: mongAuth.pass,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB using collection " + collectionname);
  });
};

//Connect to MongoDB
exports.cnctDB = (collectionname) => {
  let dbLink = `mongodb://localhost/${collectionname}`;
  mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB using " + collectionname);
  });
};

//Finds "toFind" in Database on the Model provided
exports.findInDBOne = async (Model, toFind) => {
  return await Model.findOne({ name: toFind });
};

//Finds "toFind" in Database on the Model provided
exports.findRoomInDB = async (Model, toFind) => {
  return await Model.findOne({ roomName: toFind });
};

exports.addMessageToRoom = async (Model, roomName, Message) => {
  await Model.updateOne(
    { roomName: roomName },
    { $push: { messages: Message } }
  );
};

exports.findInDBOneRoom = async (Model, toFind) => {
  return await Model.findOne({ roomName: toFind });
};

exports.findInDB = async (Model) => {
  return await Model.find({});
};

exports.searchInDB = async (Model, limit, search) => {
  const regex = new RegExp(escapeRegex(search), "gi");

  let tmp;

  try {
    tmp = await Model.find({
      $and: [{ $or: [{ _id: ObjectID(search) }] }],
    })
      .sort({ views: -1 })
      .limit(limit);
  } catch (error) {
    tmp = await Model.find({
      $and: [{ $or: [{ name: regex }, { desc: regex }] }],
    })
      .sort({ views: -1 })
      .limit(limit);
  }

  return tmp;
};

exports.findUserWithID = async (Model, toFind) => {
  return await Model.findOne({ _id: toFind });
};

exports.updateViews = async (Model, id) => {
  await Model.update({ _id: ObjectID(id) }, { $inc: { views: 1 } });
};

//takes input with type Model. Saves that model in Database. Cant be used before cnctDB or cnctDBAuth.
exports.saveToDB = (input) => {
  input.save(() => {});
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
