const url = "http://localhost:5000/"

let list = document.querySelector(".users-list")
let itemsUsers = list.children

let inputPost = (document.querySelector(".todo-input-post").hidden = true)
let formPost = (document.querySelector(".todo-post").hidden = true)

let taskTemplate = document.querySelector("#users-template").content
let newItemTemplate = taskTemplate.querySelector(".todo-list-user")

let openTasksPage = document.querySelector(".open-tasks-page")

let idAndDescription = []

let userId

function fetchGet() {
    let body = {
        users_list: true,
    }
    fetch(url, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then((data) => {
        data.json().then((data) => {
            let all_data = Array(data)[0]["users"]
            for (let user of all_data) {
                idAndDescription.push(user)
            }
        })
    })
}

async function fetchDelete(body) {
    const response = await fetch(url, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    return await response.json()
}

let addCheckHandler = (index, item) => {
    var checkbox = item.querySelector(".todo-list-input")
    checkbox.onchange = () => {
        let body = { users_id: index }
        fetchDelete(body)
            .then((data) => console.log(data))
            .catch((error) => console.log(`Error Delete request ${error}`))
        item.remove()
    }
    fetchGet()
}

window.onload = () => {
    let body = {
        users_list: true,
    }
    fetch(url, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then((data) => {
        data.json().then((data) => {
            let all_data = Array(data)[0]["users"]
            for (let user of all_data) {
                idAndDescription.push(user)
                let userName = newItemTemplate.cloneNode(true)
                let userNameText = userName.querySelector("span")
                userNameText.textContent = user[1]
                addCheckHandler(user[0], userName)
                list.append(userName)
                inputPost.value = ""
            }
            userId = data["users_id"]
        })
    })
}

openTasksPage.onclick = (event) => {
    event.preventDefault()
    let href =
        "http://localhost:63342/package-lock.json/%D0%9A%D0%9E%D0%94/fullstack_project/tasksList/tasks/frontend/tasks/tasks.html?_ijt=u4djoe8qnnmprel5nbopdspnm7"
    document.location["href"] = href
}
