'use strict';
var cookie = {};

if (document.cookie) {
    cookie = JSON.parse(document.cookie);
}

if (!cookie.chatUserName) {
    drawIntro();
}

function drawIntro() {
    let intro = document.createElement('div');
    intro.setAttribute('class', 'intro__wrapper');
    let point = document.body.firstChild;
    let form = document.createElement('form');
    form.classList.add('intro__form');
    form.action = 'javascript:enterChat()'; 
    let title = document.createElement('h1');
    title.classList.add('intro__title');
    title.innerHTML = 'Добро пожаловать!';
    let quest = document.createElement('h3');
    quest.classList.add('intro__question');
    quest.innerHTML = 'Пожалуйста, представьтесь:';
    let nameField = document.createElement('input');
    nameField.classList.add('intro__name');
    nameField.id = 'login';
    nameField.setAttribute('placeholder', 'Введите ваше имя');
    let submitBut = document.createElement('input');
    submitBut.classList.add('intro__button');
    submitBut.type = 'button';
    submitBut.value = 'Войти в чат';
    submitBut.setAttribute('onclick', 'enterChat()');
    let alert = document.createElement('div');
    alert.classList.add('intro__alert');
    alert.innerHTML = 'Сайт использует cookie для хранения информации о Вас, имейте это в виду.';
    intro.appendChild(form);
    form.appendChild(title);    
    form.appendChild(quest);
    form.appendChild(nameField);
    form.appendChild(submitBut);
    form.appendChild(alert);
    document.body.insertBefore(intro, point);
    document.getElementById('login').focus();
}

function enterChat() {
    let name = escapeHTML(document.querySelector('#login').value);
    if (name != false) {
        if (name.length > 25) {
            alert('Имя слишком длинное, мы не сможем его запомнить. Напишите Ваше имя длиной до 25 символов');
            return;
        }
        cookie.chatUserName = name;
        cookie.currentRoom = 'general';
        cookie.avatarImage = Math.floor(Math.random() * 10) + 1;
        document.getElementById('sidebarUsername').innerHTML = cookie.chatUserName;
        document.getElementById('currentRoom').innerHTML = '# ' + cookie.currentRoom;
        let el = document.querySelector('.intro__wrapper');
        document.body.removeChild(el);
        refreshMessages();
        dataToCookie();
    }
}

function maxLengthName(text) {
    if (text.length > 30) {
        alert('Имя слишком длинное, мы не сможем его запомнить. Напишите Ваше имя длиной до 30 символов');
    }
}
