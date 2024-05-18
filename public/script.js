const tasksDOM = document.querySelector(".display_contianer");
const loadingDOM = document.querySelector(".loading_text");
const formDOM = document.querySelector(".input_container");
const taskInputDOM = document.querySelector(".input_task");
const formAlertDOM = document.querySelector(".form_alert");

const PORT = 5000;
const localhost = `http://localhost:${PORT}`;

// Load tasks from /api/tasks
const showTasks = async () => {
    loadingDOM.style.visibility = "visible";
    try {
        const {
            data: { tasks },
        } = await axios.get(`${localhost}/api/v1/tasks`, {
            // headers: {
            //     "Access-Control-Allow-Origin": "*"
            // },
        });
        if (tasks.length < 1) {
            tasksDOM.innerHTML =
                '<h5 class="empty_list">No tasks in your list</h5>';
            loadingDOM.style.visibility = "hidden";
            return;
        }
        const allTasks = tasks
            .map((task) => {
                const { completed, _id: taskID, name } = task;
                return `<div class="task ${completed && "task-completed"}">
<p><span><i class="far fa-check-circle"></i></span>${name}</p>
<div class="task-links">



<!-- edit link -->
<a href="editTask.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
            })
            .join("");
        tasksDOM.innerHTML = allTasks;
    } catch (error) {
        tasksDOM.innerHTML =
            '<h5 class="empty_list">There was an error, please try later....</h5>';
    }
    loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
    const el = e.target;
    if (el.parentElement.classList.contains("delete-btn")) {
        loadingDOM.style.visibility = "visible";
        const id = el.parentElement.dataset.id;
        try {
            await axios.delete(`${localhost}/api/v1/tasks/${id}`);
            showTasks();
        } catch (error) {
            console.log(error);
        }
    }
    loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = taskInputDOM.value;

    try {
        await axios.post(`${localhost}/api/v1/tasks`, { name });
        showTasks();
        taskInputDOM.value = "";
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = `success, task added`;
        formAlertDOM.classList.add("text-success");
    } catch (error) {
        // error.response.data.msg.message;
        formAlertDOM.style.display = "block";
        formAlertDOM.innerHTML = `error, please try again`;
    }
    setTimeout(() => {
        formAlertDOM.style.display = "none";
        formAlertDOM.classList.remove("text-success");
    }, 3000);
});
