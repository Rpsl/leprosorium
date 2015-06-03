// ==UserScript==
// @name		Leprosorium scroll to top
// @namespace	leprosorium++scrolltotopv2
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @require     zepto.min.js
// ==/UserScript==

function main(){


    var scroll = $('<div>&nbsp;</div>',{ 'id': 'scroll_to_top'}).css({
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

        $(document.body).on('click', '#scroll_to_top', function(e){
            $(scroll).css('display', 'none');
            window.scrollTo(0,0);
            return false;
        });

        window.setInterval(setScroll, 5000);
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