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


function main() {
    window.user_names_gender = null;

    comments_gender();

    window.clearInterval(window.user_names_gender);
    window.user_names_gender = setInterval(comments_gender, 20000);
}

function comments_gender() {

    var comments = document.querySelectorAll('.comment'),
        comment, style;

    for (var i = 0, len = comments.length; i < len; i++) {
        comment = comments[i];

        var c_user = comment.querySelector('.c_user');

        if (!c_user || c_user.classList.contains('gender')) {
            continue;
        }

        var data = comment.dataset;

        if (data.user_gender !== undefined && data.user_gender == 'female') {
            c_user.classList.add('gender_female');
        } else {
            c_user.classList.add('gender_male');
        }

        c_user.classList.add('gender');
    }

    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = " .gender_male { color: #3A3AC4!important } \
                        .gender_female { color: #DD2B2B!important }";

    document.body.appendChild(style);

}

kango.invokeAsync('kango.storage.getItem', 'plugins', function (value) {

    var name = 'commentsgender';

    if (value !== null && value.hasOwnProperty(name) && value[name] == 1) {
        main();
    }
});