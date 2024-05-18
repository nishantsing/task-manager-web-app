# Task Manager Simple Web App

- public if static pages with minimal interaction
- views if template engine is used.


- app.get('/api/v1/tasks') - get all the tasks
- app.post('/api/v1/tasks') - create a new task
- app.get('/api/v1/tasks/:id') - get a single task
- app.patch('/api/v1/tasks/:id') - update task
- app.delete('/api/v1/tasks/:id') - delete task


- set basic routes and controllers and test them using postman
- then setup db connection and test connection

- only the properties mentioned in schema are set in database rest are ignored
- empty objects can be added in the collection so we need to apply some validations
[Mongoose Validation](https://mongoosejs.com/docs/validation.html)

```js
// Schema validators
name: {
        type: String,
        required:[true, 'must provide a name'],
        trim:true,
        maxlength:[20,'name can not be more than 20 characters']
    }

```

- how to make try and catch block generic as we are going to use them in all controller functon
- how to show more precise error

- queries are not promise, its just for convinence.
[Mongoose Queries](https://mongoosejs.com/docs/queries.html)

- Task.find({})
- Task.create({})
- Task.findOne({_id:}) - always check whethere the task with the id exists
- findOneAndUpdate({_id:}, {}) - gets oldOne and doesn't run validator
- update options findOneAndUpdate({_id:}, req.body, {new:true, runValidators: true}) 
- Task.findOneAndDelete({_id:}) - always check whethere the task with the id exists

- To use static file
app.use(express.static('./public'))

#### Making API better

##### put vs patch
- put try to overwrite with the passed object
- update options findOneAndUpdate({_id:}, req.body, {new:true, runValidators: true, overwrite: true})

- patch trying to update the part of the object
- update options findOneAndUpdate({_id:}, req.body, {new:true, runValidators: true}) 

##### Different Response style
- res.status(200).json({tasks})
- res.status(200).json({tasks, amount:tasks.length})
- res.status(200).json({success:true, data:{tasks, nbHits:tasks.length}})
- res.status(200).json({status:'success', data:{tasks, nbHits:tasks.length}})

- stay consistent


##### Middlewares
###### Route Not Found
- setting custom 404 page.

```js
// middlewares/notFound

const notFound = (req,res)=>{
    res.status(404).send('Route does not exist')
}

module.exports = notFound

// server

const notFound = require("./middlewares/notFound.js");


app.use(notFound);

```

###### Async Wrappers for try and catch

```js
// middlewares/async
const asyncWrapper = (fn)=>{
    return async(req, res, next)=>{
        try{
            await fn(req, res, next)
        }catch(err){
            next(err) // handled by built in express handler but we can make our custom error handler
        }
    }
}

module.exports = asyncWrapper

// controllers/ taskController.js
const asyncWrapper = require('../middleware/async')

const getAllTasks = asyncWrapper(async (req, res) => {
    // try {
        const tasks = await Task.find({});
        res.status(200).json({ tasks });
    // // } catch (err) {
    //     res.status(500).json({ msg: err });
    // }
    // res.send("all tasks");
})

```

###### Catching Errors

```js
// middlewares/errorHandler
const errorHandler = (err, req, res, next)=>{
    return res.status(500).json({msg: err})
}

module.exports = errorHandler

// server

const errorHandler = require("./middlewares/errorHandler.js");
app.use(errorHandler);

```



###### 404 Custom Errors

```js

// errors/customError.js

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message); // invokes constructor of parent class
        this.statusCode = statusCode;
    }
}

const createCustomError = (msg, statusCode) => {
    return new CustomAPIError(msg, statusCode);
};

module.exports = { createCustomError, CustomError };


// controllers/ taskController.js

const {createCustomError} = require('../errors/customError')
const getTask = asyncWrapper(async (req, res, next) => {
   
        const { id: taskID } = req.params;
        const task = await Task.findOne({ _id: taskID });
        if (!task) {
            return next(createCustomError(`No task with id: ${taskID}`, 404));
        }
        res.status(200).json({ task });
});

// middlewares/errorHandler
const { CustomError } = require("../errors/customError");

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    return res
        .status(500)
        .json({ msg: `Something went wrong, please try again` });
};

module.exports = errorHandler;
```
