'use strict';

function userSettings() {
    let point = document.body.firstChild;
    let block = document.createElement('div');
    block.classList.add('overlay__wrapper');
    let form = document.createElement('form');
    form.classList.add('overlay__form');
    form.action = 'javascript:setSettings()';
    let title = document.createElement('h1');
    title.classList.add('overlay__title');
    title.innerHTML = 'Настройки пользователя';
    let nameField = document.createElement('input');
    nameField.classList.add('overlay__input');
    nameField.id = 'newUserName';
    nameField.setAttribute('placeholder', cookie.chatUserName);
    let avaBlock = document.createElement('div');
    avaBlock.classList.add('avatar__selector');
    avaBlock.id = 'avatarField';
    let submitBut = document.createElement('input');
    submitBut.classList.add('overlay__button');
    submitBut.type = 'button';
    submitBut.value = 'Сохранить';
    submitBut.setAttribute('onclick', 'saveSettings()');
    let cancelBut = document.createElement('input');
    cancelBut.classList.add('overlay__button');
    cancelBut.type = 'button';
    cancelBut.value = 'Отмена';
    cancelBut.setAttribute('onclick', 'eraseOverlay()');
    let exitBut = document.createElement('input');
    exitBut.classList.add('overlay__button');
    exitBut.type = 'button';
    exitBut.value = 'Покинуть чат';
    exitBut.setAttribute('onclick', 'exitChat()');
    block.appendChild(form);
    form.appendChild(title);
    form.appendChild(nameField);
    form.appendChild(avaBlock);
    form.appendChild(submitBut);
    form.appendChild(cancelBut);
    form.appendChild(exitBut);
    document.body.insertBefore(block, point);
    avatarSelector();
    avaBlock.addEventListener('click', selectAvatar);
}

function avatarSelector() {
    let avaBlock = document.querySelector('#avatarField');
    for (let i=1; i<11; i++) {
        let avatarka = 'url(avatars/'+ i + '.png)';
        let avatar = document.createElement('div');
        avatar.classList.add('selector__avatar');
        if (i == cookie.avatarImage) {
            avatar.classList.add('selected__avatar');
        }
        avatar.setAttribute('name', i);
        avatar.style.backgroundImage = avatarka;
        avaBlock.appendChild(avatar);
    }
}

function selectAvatar(e) {
    if (document.querySelector('.selected__avatar')) {
        document.querySelector('.selected__avatar').classList.remove('selected__avatar');
    }
    e.target.classList.add('selected__avatar');
}

function saveSettings() {
    if (document.getElementById('newUserName').value) {
        if (document.getElementById('newUserName').value.length > 25) {
            alert('Имя слишком длинное, мы не сможем его запомнить. Напишите Ваше имя длиной до 25 символов');
            return;
        }
        cookie.chatUserName = escapeHTML(document.getElementById('newUserName').value);
    }
    cookie.avatarImage = document.querySelector('.selected__avatar').getAttribute('name');
    dataToCookie();
    eraseOverlay();
}