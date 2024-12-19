"use strict";

const form = document.getElementById('taskForm')
form.addEventListener('submit', event => {//function used for add task to the tasks board, when submit is sent
    event.preventDefault();
    const data = collectData();
    if (checkDate(data)) {
        const newHTML = generateHTML(data);
        saveTaskToStorage(data);
        renderHTML(newHTML);
        setTimeout(() => { document.getElementById(`${data.taskIndex}`).classList.add("visible"); }, 10)
    } else {
        alert("error: the date has expired. please enter a valid future date");
    }
    clearForm();
})

const collectData = () => { //collect the data the user gave us in the inputs
    const description = document.getElementById("description").value;
    const time = document.getElementById("time").value;
    const date = document.getElementById("date").value;
    const string = JSON.parse(localStorage.getItem("tasks"));
    let taskIndex = string.length;
    return {
        description,
        time,
        date,
        taskIndex
    }
}

const generateHTML = data => { //create the HTML of the task, based on the data we give
    const newHTML = `
            <div class="task" id=${data.taskIndex}>
            <div class="description">${data.description}</div>
            <div class="time">${data.time}</div>
            <div class= "date">${data.date}</div>
            <button class="glyphicon glyphicon-remove-sign" onclick="deleteTask(${data.taskIndex})" />
        </div>
`;
    return newHTML;
}

const renderHTML = newHTML => { //add the HTML of new task, to the tasks board in the DOM
    const tasks = document.getElementById("tasks");
    tasks.innerHTML = newHTML + tasks.innerHTML;
}

const clearForm = () => { //clear the form
    const taskForm = document.getElementById("taskForm");
    taskForm.reset();
}

const initStorage = () => { //initialize the dom, based on the data in the local server. if there isn`t one, it creates new key named "tasks".
    const currentTasksInStorageJSON = localStorage.getItem("tasks");
    if (!currentTasksInStorageJSON) {
        localStorage.setItem("tasks", JSON.stringify([]));
    } else {
        loadTasksFromLocalStorage();
    }
}

const saveTaskToStorage = taskObject => { //save single task to the local storage
    const currentTasksInStoragesJSON = localStorage.getItem("tasks");
    const currentTasksInStorage = JSON.parse(currentTasksInStoragesJSON);
    currentTasksInStorage.push(taskObject);
    localStorage.setItem("tasks", JSON.stringify(currentTasksInStorage));
}

const loadTasksFromLocalStorage = () => { //takes the data in the local storage and present it in the dom (if the date is vallid)
    const tasksInStorageJSON = localStorage.getItem("tasks");
    if (tasksInStorageJSON) {
        const tasks = JSON.parse(tasksInStorageJSON);
        deleteDom();
        for (const task of tasks) {
            if (!checkDate(task)) {
                tasks.splice(task.taskIndex, 1)
            } else {
                const newHTML = generateHTML(task);
                renderHTML(newHTML);
                setTimeout(() => { document.getElementById(`${task.taskIndex}`).classList.add("visible"); }, 10)
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
}

const deleteTask = taskIndex => { //delete specific task from the tasks board
    const tasksArray = JSON.parse(localStorage.getItem("tasks"));
    tasksArray.splice(taskIndex, 1);
    for (let i = 0; i < tasksArray.length; i++) {
        tasksArray[i].taskIndex = i;
    }
    deleteDom();
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    loadTasksFromLocalStorage();
}

const checkDate = data => { //check if the time of the task has gone
    let dateInput = data.date + "T" + data.time + ":00";
    dateInput = new Date(dateInput);
    const now = new Date();
    const validationDate = dateInput > now ? true : false;
    return validationDate;
}

const deleteDom = () => { //deletes the data presented in the dom
    let tasksContainer = document.getElementById("tasks");
    tasksContainer.innerHTML = ``;
}
initStorage();