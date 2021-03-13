let list = document.querySelector('.todo-list')
let inputPost = document.querySelector('.todo-input-post')
let formPost = document.querySelector('.todo-post')

let inputPutDescription = document.querySelector('.todo-input-put-desc')
let inputPutTasksId = document.querySelector('.todo-input-put-id')
let formPut = document.querySelector('.todo-put')

let inputDelete = document.querySelector('.todo-input-delete')
let formDelete = document.querySelector('.todo-delete')

const url = 'http://localhost:5000/'

let idAndDescription = []


function fetchGet() {
    fetch(url, {method: 'get'}).then(data => {
        data.json().then(data => {
            let all_data = Array(data)[0]['data']
            for (let task of all_data) {
                idAndDescription.push(task)
            }
        })
    })
}

async function fetchPost(body) {
    const response = await fetch(url, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    return await response.json()
}

async function fetchPut(body) {
    const response = await fetch(url, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    return await response.json()
}

async function fetchDelete(body) {
    const response = await fetch(url, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    return await response.json()
}

window.onload = () => {
    fetch(url, {method: 'get'}).then(data => {
        data.json().then(data => {
            let all_data = Array(data)[0]['data']
            for (let task of all_data) {
                idAndDescription.push(task)
                let newTask = document.createElement('li')
                newTask.textContent = task[1]
                list.append(newTask)
                inputPost.value = ''
            }
        })
    })
}


formPost.onsubmit = event => {
    event.preventDefault()
    let newTask = document.createElement('li')
    let value = inputPost.value
    newTask.textContent = value
    list.append(newTask)
    let body = {description: value}
    fetchPost(body).then(data => console.log(data))
    inputPost.value = ''
}

formPut.onsubmit = event => {
    event.preventDefault()
    let description = inputPutDescription.value
    let tasksId = Number(inputPutTasksId.value) - 1
    let tagLiDescription = document.querySelectorAll('li')
    for (let desc of idAndDescription) {
        if (desc[1] === tagLiDescription.item(tasksId).textContent) {
            tagLiDescription.item(tasksId).textContent = description
            let body = {description: description, tasks_id: desc[0]}
            fetchPut(body).then(data => console.log(data))
                .catch(error => console.log(`Error from Put ${error}`))
        }
    }
    fetchGet()
}

formDelete.onsubmit = event => {
    event.preventDefault()
    let tasksId = Number(inputDelete.value) - 1
    let tagLiDescription = document.querySelectorAll('li')
    for (let desc of idAndDescription) {
        if (desc[1] === tagLiDescription.item(tasksId).textContent) {
            tagLiDescription.item(tasksId).remove()
            let body = {tasks_id: desc[0]}
            fetchDelete(body).then(data => console.log(data))
                .catch(error => console.log(`Error from Delete ${error}`))
        }
    }
    fetchGet()
}