// ==UserScript==
// @name		Leprosorium remove comments borders
// @namespace	leprosorium++removecommentsborders
// @author	    Rpsl
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// ==/UserScript==

function main() {

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.b-comment_outline { border: none; } .b-icon_button_close { opacity: 0.5 }';

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'removecommentsborders';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});