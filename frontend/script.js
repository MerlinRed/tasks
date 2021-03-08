let list = document.querySelector('.todo-list')
let input = document.querySelector('.todo-input')
let form = document.querySelector('.todo-form')

const url = 'http://127.0.0.1:5000/'
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

function fetchGet() {
    return fetch(url, {
        method: 'GET',
        headers: headers,
        mode: 'no-cors',
    })
        .then(response => {
            return response.json()
        })
}

//используется стрелочная функция
form.onsubmit = event => {
    let newTask = document.createElement('li')
    event.preventDefault()
    newTask.textContent = input.value
    list.append(newTask)
    input.value = ''
    //используется запрос на сайт
    fetchGet().then(data => console.log(data))
}