const express = require("express");
// const cors = require("cors");
const connectDB = require("./db/connect.js");
require("dotenv").config();
const app = express();
const notFound = require("./middlewares/notFound.js");
const tasks = require("./routes/tasksRouter.js");
const errorHandler = require("./middlewares/errorHandler.js");
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.static("./public"));
app.use(express.json());
// app.use(cors()); // To allow access from same origin, is there an alternative way yes just spin the server and access public files on localhost:5000

app.use("/api/v1/tasks", tasks);
app.use(notFound);
app.use(errorHandler); // overrides the error handling provided by express

const start = async (URI) => {
    try {
        await connectDB(URI);
        app.listen(5000, console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.log(err);
    }
};

start(process.env.MONGO_URI);
