'use strict';

$('body').click(function(e){
   if (e.target.id === 'addButton') {
       $('#addButton').toggleClass('add-line');
       $('#addButton').toggleClass('icon-plus');
       drawAddButtons();
   }
   else {
       $('#addButton').removeClass('add-line');
       $('#addButton').addClass('icon-plus');
       eraseAddButtons();
   }
});

function drawAddButtons() {
    $('#addButton').append($('<div>').html('Код').attr('onclick', 'addCode()'));
    $('#addButton').append($('<div>').html('Ссылка').attr('onclick', 'log(\'Ссылка\')'));
    $('#addButton').append($('<div>').html('Изображение').attr('onclick', 'log(\'Изображение\')'));
}
function eraseAddButtons() {
    $('#addButton').html('');
}

function log(str) {
    console.log(str);
}

function addCode() {
    $('body').append($('<div>').addClass('modal-overlay'));
    $('.modal-overlay').append($('<form>').addClass('modal-form overlay__form'));
    $('.modal-form').append($('<h1>').addClass('overlay__title').html('Введите код:'));
    $('.modal-form').append($('<textarea>').addClass('modal-textarea'));
    $('.modal-form').append($('<input>').val('Отправить').attr('type', 'button').attr('onclick', 'sendCode()').addClass('overlay__button'));
    $('.modal-form').append($('<input>').val('Отмена').attr('type', 'button').attr('onclick', 'eraseModal()').addClass('overlay__button'));
}

function eraseModal() {
    $('.modal-overlay').remove();
}