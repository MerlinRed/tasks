const url = 'http://localhost:5000/'

let formRegistration = document.querySelector('.registration')
let loginReg = document.querySelector('.login-reg')
let passwordReg = document.querySelector('.password-reg')

let formEnter = document.querySelector('.enter')
let loginEnter = document.querySelector('.login-enter')
let passwordEnter = document.querySelector('.password-enter')

let wrongData = document.querySelector('.wrong-data')
wrongData.hidden = true

async function requestToServer(body, method) {
    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    return await response.json()
}



formRegistration.onsubmit = evt => {
    evt.preventDefault()
    let body = {
        login: loginReg.value,
        password: passwordReg.value,
        user: true
    }
    requestToServer(body, 'post')
}

formEnter.onsubmit = evt => {
    evt.preventDefault()
    let body = {
        login: loginEnter.value,
        password: passwordEnter.value,
        user: false
    }
    requestToServer(body, 'post').then(data => {
        if (data['data'] === null) {
            wrongData.hidden = false
            console.log(null)
        }
        else {
            wrongData.hidden = true
            let href = 'http://localhost:63342/package-lock.json/%D0%9A%D0%9E%D0%94/fullstack_project/tasksList/tasks/frontend/tasks/tasks.html?_ijt=u4djoe8qnnmprel5nbopdspnm7'
            document.location['href'] = href
        }
    })

}