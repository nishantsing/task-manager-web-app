const Task = require("../models/Tasks");
const asyncWrapper = require("../middlewares/async");
const { createCustomError } = require("../errors/customError");

const getAllTasks = asyncWrapper(async (req, res) => {
    // try {
    const tasks = await Task.find({});
    res.status(200).json({ tasks });
    // // } catch (err) {
    //     res.status(500).json({ msg: err });
    // }
    // res.send("all tasks");
});
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ task });
    } catch (err) {
        res.status(500).json({ msg: err });
    }
};

const getTask = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOne({ _id: taskID });
        if (!task) {
            return next(createCustomError(`No task with id: ${taskID}`, 404));
        }
        res.status(200).json({ task });
    } catch (err) {
        res.status(500).json({ msg: err });
    }
    // res.json({ id: req.params.id });
};

const updateTask = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            return res.status(404).json({ msg: `No task with id: ${taskID}` });
        }
        res.status(200).json({ task });
        // res.status(200).send();
        // res.status(200).json({ task: null, status:'success' });
    } catch (err) {
        res.status(500).json({ msg: err });
    }
    // res.send("update task");
};

const deleteTask = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOneAndDelete({ _id: taskID });
        if (!task) {
            return res.status(404).json({ msg: `No task with id: ${taskID}` });
        }
        res.status(200).json({ task });
    } catch (err) {
        res.status(500).json({ msg: err });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
};
