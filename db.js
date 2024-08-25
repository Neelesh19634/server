const mongoose=require('mongoose');
const URL ="mongodb+srv://nkmkumar437:YR3CSwORBepDgCFK@cluster0.oxay9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 "
// const URL = "mongodb://localhost:27017/mern5";

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