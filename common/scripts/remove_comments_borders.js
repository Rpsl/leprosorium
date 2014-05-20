// ==UserScript==
// @name		Leprosorium remove comments borders
// @namespace	leprosorium++removecommentsborders
// @author	    Rpsl
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// ==/UserScript==

function main() {

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.b-comment_outline { border: none; }';

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