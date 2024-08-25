const mongoose=require('mongoose');
// const URL = "mongodb://localhost:27017/mern5";

const connect = async () => {
try {
await mongoose.connect(process.env.URL);
console.log("connected to database");
} catch (error) {
console.log("error in connecting to database");
process.exit(0);
}
};
module.exports = connect;