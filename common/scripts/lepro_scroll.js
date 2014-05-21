// ==UserScript==
// @name		Leprosorium scroll to top
// @namespace	leprosorium++scrolltotopv2
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @require     zepto.js
// ==/UserScript==

function main(){

    $('#js-content_aside_subsite').css({
//        'background-color': 'white',
        'z-index': -1
    });

    var scroll = $('<div>&nbsp;</div>',{ 'id': 'scroll_to_top', onclick: "scroll(0,0);return false;"}).css({
            'background-color': "#f8f8f8",
            position: "fixed",
            width: "30px",
            height: "100%",
            left: "0px",
            top:"1px",
            display: "none",
            cursor: "pointer",
            opacity:"0.4",
            'border-right':'1px solid #ddd'
        });

    var wrapper = $('.l-i-content');

    if( wrapper.length = 1 )
    {
        wrapper = $('.l-content');
    }

    if( wrapper.length = 1 ) {


        $(wrapper).append(scroll);


        window.onscroll = function() {

            setScroll();
        };
    }

    function setScroll(){

        if ( $(window).scrollTop() < 800 ) {
            $(scroll).css('display', 'none');
        } else {
            $(scroll).css('display', 'block');
        }
    }
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'leproscroll';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});