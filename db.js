const mongoose = require("mongoose");

const URL ="mongodb://127.0.0.1:27017/intagramclone "

const connect = async () => {
  try {
    await mongoose.connect(URL);
    console.log("connected to database");
  } catch (error) {
    console.log("error in connecting to database");
    process.exit(0);
  }
};
module.exports = connect;
