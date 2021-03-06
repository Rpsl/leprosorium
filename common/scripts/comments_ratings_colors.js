// ==UserScript==
// @name           Size and color of rating according to it, no Zero
// @namespace      leprosorium++commentsratings
// @description    Увеличивает размер и меняет цвет шрифта оценки в зависимости от рейтинга. Делает оценку O белой.
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @require        zepto.min.js
// ==/UserScript==

function main() {

    window.colorized_interval = null;

    var good_limit = 300;

    function d2h(d) {
        d = Math.abs(d);
        d = d % good_limit;
        d = good_limit / 4 + 3 * d / 4;
        d = Math.round(256 * d / good_limit);
        var str = d.toString(16);
        if (str.length == 2) return str;
        else return "0" + str;
    }

    function colorize() {
        var vote_results = $('#js-comments').find('.vote_result');

        if( vote_results.length == 0 ) {
            vote_results = $('.b-user_posts').find('.comment .vote_result');
        }

        $.each(vote_results, function(k, v) {

            if( v.classList == undefined || v.classList.contains('colorized') ) {
                return;
            }

            v.classList.add('colorized');

            var rating = parseInt($(v).html(), 10);

            var style = {};

            if ((rating > good_limit * 2)) {
                style["color"] = "#0000" + d2h(rating);
                style["padding-right"] = "10px";
            } else if ((rating > good_limit) && (rating < good_limit * 2)) {
                style["color"] = "#00" + d2h(good_limit * 2 - rating - 1) + d2h(rating);
            } else if (rating > 0 && rating <= good_limit) {
                style["color"] = "#00" + d2h(rating) + "00";
            } else if (rating == 0) {
                style["color"] = "#ffffff";
            } else if (rating < 0) {
                rating = 0;
            } else if (rating < 0 && rating >= -good_limit) {
                style["color"] = "#" + d2h(rating) + "0000";
            } else if (rating < -good_limit) {
                style["color"] = "#ff0000";
            }

            style["font-size"] = Math.min(16, 9 + 2 * Math.log(Math.abs(rating) + 1)) + "px";

            $(v).css(style);
        });
    }

    colorize();

    window.clearInterval( window.colorized_interval );
    window.colorized_interval = setInterval(colorize, 20000);
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'commentsratings';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
