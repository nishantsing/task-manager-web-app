const express = require("express");
const app = express();

const tasks = require("../routes/tasksRouter");
const PORT = 5000;


//middleware
app.use(express.json())

app.use('/api/v1/tasks',tasks)



app.listen(5000, console.log(`Server running on port ${PORT}`));