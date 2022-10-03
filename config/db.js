const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

mongoose.Promise = global.Promise;

const connect = async () => {
  try {
    await mongoose.connect(db);
    console.log("mongodb connected...");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

const connection = mongoose.connection;

exports.connect = connect;
exports.connection = connection;
