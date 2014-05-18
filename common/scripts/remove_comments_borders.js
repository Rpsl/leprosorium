// ==UserScript==
// @name		Leprosorium remove comments borders
// @namespace	leprosorium++removecommentsborders
// @author	    Rpsl
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// @require     jquery-1.9.1.min.js
// ==/UserScript==

function main() {
    jQuery('.b-comment_outline').css('border-style', 'none');
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'removecommentsborders';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});