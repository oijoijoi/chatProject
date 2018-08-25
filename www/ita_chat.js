'use strict';

var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
var messages; // элемент массива - {name:senderName, avat:avaName, time:date, room:roomName, mess:message};
var currentChat;
const password = '1';
var stringName='LOBANOV_CHAT_MESSAGES';
var roomsArr = [];
$.support.cors = true;
var monthArr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

// показывает все сообщения из messages на страницу

function showMessages() {
    document.getElementById('chat-field').innerHTML = '';
    sortMessagesByRoom();
    renderMessages();
}
function sortMessagesByRoom() {
    currentChat = [];
    let room = cookie.currentRoom;
    messages.forEach(function(el) {
        if (el.room == room) {
            currentChat.push(el);
        }
    });
}

function renderMessages() {
    document.getElementById('sidebarUsername').innerHTML = cookie.chatUserName;
    for (let i=0; i<currentChat.length; i++) {
        let message = currentChat[i];
        let currentTime = new Date(message.time);
        let prevMessage = currentChat[i-1];
        if (prevMessage == undefined) {
            drawDateLine(currentTime);
            drawMessage(message, currentTime);
            continue;
        }        
        let prevTime = new Date(prevMessage.time);
        if (currentTime.getDay() > prevTime.getDay()) {
            drawDateLine(currentTime);
        }
        if (message.name === prevMessage.name && currentTime.getDay() == prevTime.getDay() && currentTime-prevTime < 1800000) {
            drawSmallMessage(message);
        }
        else {
            drawMessage(message, currentTime);
        }
    }
}

function drawDateLine(date) {
    var day = date.getDate();
    var month = date.getMonth();
    var monthName = monthArr[month];
    var block = document.createElement('div');
    block.classList.add('date-line');
    var time = document.createElement('div');
    time.classList.add('date-line-text');
    time.innerHTML = monthName+', '+day;
    block.appendChild(time);
    document.getElementById('chat-field').appendChild(block);
}

function drawMessage(message, date) {
    var avatarka = 'url(avatars/'+ message.avat + '.png)';
    var block = document.createElement('div');
    var avatar = document.createElement('div');
    var textBlock = document.createElement('div');
    var title = document.createElement('div');
    var text = document.createElement('div');
    var time = document.createElement('span');
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (minute<10) {
        minute = '0'+minute;
    }
    block.classList.add('message');
    avatar.classList.add('message__avatar');
    avatar.style.backgroundImage = avatarka;
    textBlock.classList.add('message__text');
    title.classList.add('message__title');
    text.classList.add('message__content');
    title.innerHTML = escapeHTML(message.name);
    time.innerHTML = ' ' + hour + ':' + minute;
    text.innerHTML = escapeHTML(message.mess);
    block.appendChild(avatar);
    textBlock.appendChild(title);
    title.appendChild(time);
    block.appendChild(textBlock);
    textBlock.appendChild(text);
    document.getElementById('chat-field').appendChild(block);
    text.scrollIntoView();
}

function drawSmallMessage(message) {
    var block = document.createElement('div');
    block.classList.add('message');
    var text = document.createElement('div');
    text.classList.add('message__text')
    text.innerHTML = escapeHTML(message.mess);
    block.appendChild(text);
    document.getElementById('chat-field').appendChild(block);
    text.scrollIntoView();
}

function escapeHTML(text) {
    if ( !text )
        return text;
    text=text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

// получает сообщения с сервера и потом показывает
function refreshMessages() {
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST',
            dataType:'json',
            data : {f : 'READ',
                n : stringName },
            cache : false,
            success : readReady,
            error : errorHandler
        }
    );
}

function readReady(callresult) { // сообщения получены - показывает
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        messages=[];
        if ( callresult.result!="" ) { // либо строка пустая - сообщений нет
            // либо в строке - JSON-представление массива сообщений
            messages=JSON.parse(callresult.result);
            // вдруг кто-то сохранил мусор вместо LOKTEV_CHAT_MESSAGES?
            if ( !Array.isArray(messages) )
                messages=[];
        }
        showMessages();
        roomListGetter();
        document.getElementById('currentRoom').innerHTML = '# ' + cookie.currentRoom;
    }
}

// получает сообщения с сервера, добавляет новое,
// показывает и сохраняет на сервере
function sendMessage() {
    if (document.getElementById('IMess').value != false) {
        $.ajax(
            {
                url : ajaxHandlerScript,
                type : 'POST',
                dataType:'json',
                data : {f : 'LOCKGET',
                    n : stringName,
                    p : password },
                cache : false,
                success : lockGetReady,
                error : errorHandler
            }
        );
    }
}

// сообщения получены, добавляет, показывает, сохраняет
function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        messages=[];
        if ( callresult.result!="" ) // либо строка пустая - сообщений нет
        {
            // либо в строке - JSON-представление массива сообщений
            messages=JSON.parse(callresult.result);
            // вдруг кто-то сохранил мусор вместо LOKTEV_CHAT_MESSAGES?
            if ( !Array.isArray(messages) )
                messages=[];
        }

        var senderName = cookie.chatUserName;
        var avaName = cookie.avatarImage;
        var date = Date.now();
        var roomName = cookie.currentRoom;
        var message = document.getElementById('IMess').value;
        document.getElementById('IMess').value = '';
        messages.push( { name:senderName, avat:avaName, time:date, room:roomName, mess:message } );
        if ( messages.length>500 )
            messages=messages.slice(messages.length-500);
        showMessages();

        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST',
                dataType:'json',
                data : {f : 'UPDATE',
                    n : stringName,
                    v : JSON.stringify(messages),
                    p : password },
                cache : false,
                success : updateReady,
                error : errorHandler
            }
        );
    }
}

// сообщения вместе с новым сохранены на сервере
function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert('Ошибка чата '+statusStr+' '+errorStr);
}

function roomListGetter() {
    for (let i=0; i<messages.length; i++) {        
        let message = messages[i];
        let room = message.room;
        if (roomsArr.indexOf(room) == -1) {
            roomsArr.push(room);
            rooListDraw();
        }
    }
}

function rooListDraw() {
    document.getElementById('roomList').innerHTML = '';
    roomsArr.forEach(function(el) {
        let roomSpan = document.createElement('div');
        roomSpan.setAttribute('onclick', 'selectRoom("'+el+'")');
        roomSpan.classList.add('room-in-roomlist');
        roomSpan.innerHTML = '# ' + el;
        document.getElementById('roomList').appendChild(roomSpan);
    });    
}

function selectRoom(roomName) {
    cookie.currentRoom = roomName;
    document.getElementById('currentRoom').innerHTML = '# ' + roomName;
    refreshMessages();
    dataToCookie();
}

function dataToCookie() {
    document.cookie = JSON.stringify(cookie);
}

refreshMessages();
let a = setInterval(function() {
    refreshMessages();
}, 5000);

function exitChat() {
    document.cookie = '';
    cookie = {};
    location.reload();
}
function addNewRoom() {
    let point = document.body.firstChild;
    let block = document.createElement('div');
    block.classList.add('overlay__wrapper');
    let form = document.createElement('form');
    form.classList.add('overlay__form');
    form.action = 'javascript:createRoom()';
    let title = document.createElement('h1');
    title.classList.add('overlay__title');
    title.innerHTML = 'Введите имя нового канала';
    let nameField = document.createElement('input');
    nameField.classList.add('overlay__input');
    nameField.id = 'newRoomName';
    nameField.setAttribute('placeholder', 'Введите имя нового канала');
    let submitBut = document.createElement('input');
    submitBut.classList.add('overlay__button');
    submitBut.type = 'button';
    submitBut.value = 'Добавить';
    submitBut.setAttribute('onclick', 'createRoom()');
    let cancelBut = document.createElement('input');
    cancelBut.classList.add('overlay__button');
    cancelBut.type = 'button';
    cancelBut.value = 'Отмена';
    cancelBut.setAttribute('onclick', 'eraseOverlay()');
    block.appendChild(form);
    form.appendChild(title);
    form.appendChild(nameField);
    form.appendChild(submitBut);
    form.appendChild(cancelBut);
    document.body.insertBefore(block, point);
}
function createRoom() {
    let newRoomName = document.querySelector('#newRoomName').value;
    if (newRoomName.length > 25) {
        alert('Имя слишком длинное, мы не сможем его запомнить. Напишите имя канала длиной до 25 символов');
        return;
    }
    cookie.currentRoom = newRoomName;
    let roomSpan = document.createElement('div');
    roomSpan.setAttribute('onclick', 'selectRoom("'+newRoomName+'")');
    roomSpan.classList.add('room-in-roomlist');
    roomSpan.innerHTML = '# ' + newRoomName;
    document.getElementById('roomList').appendChild(roomSpan);
    eraseOverlay();
    refreshMessages();
    dataToCookie();
}
function eraseOverlay() {
    let el = document.querySelector('.overlay__wrapper');
    document.body.removeChild(el);
}

function showSidebar() {
    $('#sidebarWrapper').toggleClass('visible');
    $('.sidebar').toggleClass('full');
    $('.sidebar__arrow').toggleClass('left').fadeIn(400);
}
