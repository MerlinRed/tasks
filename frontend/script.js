let list = document.querySelector('.todo-list')
let inputPost = document.querySelector('.todo-input')
let formPost = document.querySelector('.todo-post')


const url = 'http://localhost:5000/'


async function fetchPost(body) {
    const response = await fetch(url, {
        method: 'post',
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
                let newTask = document.createElement('li')
                newTask.textContent = task
                list.append(newTask)
                inputPost.value = ''
            }
        })
    })
}

formPost.onsubmit = event => {
    let newTask = document.createElement('li')
    event.preventDefault()
    let value = inputPost.value
    newTask.textContent = value
    list.append(newTask)
    let body = {
        name: 'Jo',
        description: value
    }
    fetchPost(body).then(data => console.log(data))
    inputPost.value = ''
}