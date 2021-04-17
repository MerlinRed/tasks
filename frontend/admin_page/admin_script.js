const url = "http://localhost:5000/"

let list = document.querySelector(".users-list")

let formUpdateUser = document.querySelector(".user-to-admin")
let inputLogin = document.querySelector(".input-login")

let formRemoveFromAdmin = document.querySelector(".remove-from-admin")
let inputAdmin = document.querySelector(".input-admin")

let usersTemplate = document.querySelector("#users-template").content
let newItemTemplate = usersTemplate.querySelector(".list-user")

let openTasksPage = document.querySelector(".open-tasks-page")

async function requestToServer(body, method) {
    const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    return await response.json()
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
                let userName = newItemTemplate.cloneNode(true)
                let userNameText = userName.querySelector(".user-name")
                let userStatusText = userName.querySelector(".user-status")
                userNameText.textContent = user[1]
                if (user[3]) {
                    userStatusText.textContent = " - admin"
                } else {
                    userStatusText.textContent = " - user"
                }
                removeUser(user[0], userName)
                list.append(userName)
            }
            let userId = data["users_id"]
            if (userId == 1) {
                formUpdateUser.hidden = false
                formRemoveFromAdmin.hidden = false
            }
        })
    })
}

let removeUser = (index, item) => {
    let deleteButton = item.querySelector(".delete-user")
    deleteButton.onclick = () => {
        let body = { users_id: index }
        requestToServer(body, "delete")
            .then((data) => console.log(data))
            .catch((error) => console.log(`Error Delete request ${error}`))
        item.remove()
    }
}

function searchAndChangeElement(status, name) {
    userStatus = list.children
    for (let text of userStatus) {
        if (name == text["childNodes"][1]["children"][0]["lastChild"]["data"]) {
            text["childNodes"][1]["children"][1].textContent = ` - ${status}`
        }
    }
}

formUpdateUser.onsubmit = (event) => {
    event.preventDefault()
    let newAdmin = inputLogin.value.trim()
    let body = {
        update: true,
        admin: newAdmin,
    }
    requestToServer(body, "put").then((data) => console.log(data))
    searchAndChangeElement("admin", newAdmin)
}

formRemoveFromAdmin.onsubmit = (event) => {
    event.preventDefault()
    let removeAdmin = inputAdmin.value.trim()
    let body = {
        update: false,
        admin: removeAdmin,
    }
    requestToServer(body, "put").then((data) => console.log(data))
    searchAndChangeElement("user", removeAdmin)
}

openTasksPage.onclick = (event) => {
    event.preventDefault()
    let href =
        "http://localhost:63342/server.py/tasks/frontend/tasks/tasks.html?_ijt=p850sgddqvqgoq7hfkjeccpm2g"

    document.location["href"] = href
}
