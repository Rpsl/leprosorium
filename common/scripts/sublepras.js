// ==UserScript==
// @name		Leprosorium sublepras
// @namespace	leprosorium++sublepras
// @description Ссылки на подлепры не пропадают из навигационной панели.
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// @require        jquery-1.9.1.min.js
// ==/UserScript==


function main (){

    // список подлепр теперь отдается аяксом
    // POST+CSFR => http://leprosorium.ru/ajax/bookmarks/domain/list

    // как доставать из скрипта пока не придумал :(
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'sublepras';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});