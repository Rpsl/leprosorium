// ==UserScript==
// @name		Leprosorium youtube link converter
// @namespace	leprosorium++youtubelinks
// @author		MJ
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// ==/UserScript==

function main() {
    var anchors = document.getElementsByTagName('a');
    for(var i = 0, a; a = anchors[i]; ++i){
        if(a.href.search(/youtube\.com\/watch\?v=/) == -1 || a.parentNode.className == "Quote") continue;

        var id = (a.href.search(/&/) != -1) ? a.href.slice(a.href.search(/=/) + 1, a.href.search(/&/)) : a.href.slice(a.href.search(/=/) + 1);

//        var obj = document.createElement('object');
//        obj.width = 640; obj.height = 385;
//        obj.innerHTML = '<param value="http://www.youtube.com/v/' + id + '" name="movie"/><param name="allowFullScreen" value="true" /><param value="transparent" name="wmode"/><embed width="640" height="385" wmode="transparent" type="application/x-shockwave-flash" src="http://www.youtube.com/v/' + id + '"/><a href="http://www.youtube.com/v/' + id + '" />';

        // <iframe src="http://www.youtube.com/embed/kJ1OdKdvg4g" height="480" width="640" allowfullscreen="" frameborder="0"></iframe>

        var obj = document.createElement('p');
        obj.style = "padding: 0; margin: 0";
        obj.innerHTML = '<iframe src="http://www.youtube.com/embed/'+id+'" height="480" width="640" allowfullscreen="" frameborder="0"></iframe>';

        insertAfter( obj, a );
//        a.parentNode.insertAfter(obj,a);
//        a.parentNode.insertBefore(obj,a);
//        a.parentNode.removeChild(a);
    }
}

function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}


kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'youtubelinks';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
