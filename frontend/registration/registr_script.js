const url = "http://localhost:5000/"

let formRegistration = document.querySelector(".registration")
let loginReg = document.querySelector(".login-reg")
let passwordReg = document.querySelector(".password-reg")

let formEnter = document.querySelector(".enter")
let loginEnter = document.querySelector(".login-enter")
let passwordEnter = document.querySelector(".password-enter")

let wrongData = document.querySelector(".wrong-data")
wrongData.hidden = true

async function requestToServer(body, method) {
    const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    return await response.json()
}

formRegistration.onsubmit = (event) => {
    event.preventDefault()
    let body = {
        login: loginReg.value,
        password: passwordReg.value,
        user: true,
    }
    requestToServer(body, "post").then((data) => console.log(data))
}

formEnter.onsubmit = (event) => {
    event.preventDefault()
    let href =
        "http://localhost:63342/server.py/tasks/frontend/tasks/tasks.html?_ijt=p850sgddqvqgoq7hfkjeccpm2g"

    let body = {
        login: loginEnter.value,
        password: passwordEnter.value,
        user: false,
    }
    requestToServer(body, "post").then((data) => {
        if (data["data"] === null) {
            wrongData.hidden = false
        } else {
            wrongData.hidden = true
            if (data["data"][1]) {
                href =
                    "http://localhost:63342/server.py/tasks/frontend/admin_page/admin.html?_ijt=p850sgddqvqgoq7hfkjeccpm2g"
                document.location["href"] = href
            } else {
                document.location["href"] = href
            }
        }
    })
}
