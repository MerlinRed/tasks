const url = "http://localhost:5000/"

let list = document.querySelector(".todo-list")

let taskTemplate = document.querySelector("#users-template").content
let newItemTemplate = taskTemplate.querySelector(".list-user")

let inputPost = document.querySelector(".todo-input-post")
let formPost = document.querySelector(".todo-post")

let modalText = document.querySelector(".todo-input-text")
let buttonModalSaveText = document.querySelector(".btn-save")

let idAndDescription = []

let userId

function fetchGet() {
    let body = {
        get: true,
    }
    fetch(url, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then((data) => {
        data.json().then((data) => {
            let allData = Array(data)[0]["data"]
            for (let task of allData) {
                idAndDescription.push(task)
            }
        })
    })
}

async function fetchRequest(body, method) {
    const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    return await response.json()
}

function addNewTask(task) {
    let newTask = newItemTemplate.cloneNode(true)
    let taskDescription = newTask.querySelector(".todo-text")
    taskDescription.textContent = task
    return [newTask, taskDescription.textContent]
}

window.onload = () => {
    let body = {
        get: true,
    }
    fetch(url, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then((data) => {
        data.json().then((data) => {
            let allData = Array(data)[0]["data"]
            for (let task of allData) {
                let returnedTask = addNewTask(task[1])
                let newTask = returnedTask[0]
                let descriptionTask = returnedTask[1]
                deleteTask(task[0], newTask)
                updateTask(task[0], newTask, descriptionTask)
                list.append(newTask)
            }
            userId = data["users_id"]
        })
    })
}

formPost.onsubmit = (event) => {
    event.preventDefault()
    let value = inputPost.value
    let returnedTask = addNewTask(value)
    let newTask = returnedTask[0]
    let descriptionTask = returnedTask[1]
    list.append(newTask)
    let body = {
        description: value,
        get: false,
        users_id: userId,
    }
    fetchRequest(body, "post")
        .then((data) => {
            console.log(data)
            fetchGet()
        })
        .catch((error) => console.log(`Error POST request ${error}`))
    inputPost.value = ""
    let index = searchElements(descriptionTask)
    updateTask(index, newTask, descriptionTask)
    deleteTask(index, newTask)
}

function searchElements(descriptionTask) {
    console.log(idAndDescription)

    /* if (descriptionTask == index[1]) {
            return index[0]
        } */
}

function updateTask(index, item, text) {
    let buttonPut = item.querySelector(".btn-put")
    buttonPut.onclick = () => {
        modalText.value = text
        buttonModalSaveText.onclick = () => {
            let taskDescription = item.querySelector(".todo-text")
            let description = modalText.value
            taskDescription.textContent = description

            let body = {
                description: description,
                tasks_id: index,
            }
            console.log(body)
            fetchRequest(body, "put")
                .then((data) => {
                    console.log(data)
                    fetchGet()
                })
                .catch((error) => console.log(`Error Put request ${error}`))
        }
    }
}

let deleteTask = (index, item) => {
    let buttonDelete = item.querySelector(".btn-delete")
    buttonDelete.onclick = () => {
        item.remove()
        let body = { tasks_id: index }
        fetchRequest(body, "delete")
            .then((data) => {
                console.log(data)
                fetchGet()
            })
            .catch((error) => console.log(`Error Delete request ${error}`))
    }
}
