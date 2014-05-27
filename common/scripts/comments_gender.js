// ==UserScript==
// @name        Comments Gender
// @namespace   leprosorium++comment_gender
// @description Coloring username by gender
// @author      barbie
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @license      MIT
// @copyright  2014+, barbie
// ==/UserScript==

function comments_gender() {

    var comments = document.querySelectorAll('.ddi'),
        comment, style;

    for (var i = 0, len = comments.length; i < len; i++) {
        comment = comments[i];
        if (/^\s*Написала/.test(comment.textContent)) {
            comment.querySelector('.c_user').classList.add('gender_female');
        } else {
            comment.querySelector('.c_user').classList.add('gender_male');
        }
    }

    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = " .gender_male { color: #3A3AC4!important } \
                        .gender_female { color: #DD2B2B!important }";

    document.body.appendChild(style);

}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'commentsgender';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        comments_gender();
    }
});