// ==UserScript==
// @name		Leprosorium youtube link converter
// @namespace	leprosorium++youtubelinks
// @author		MJ
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// @require     jquery-1.9.1.min.js
// ==/UserScript==

function handle() {
    var anchors = document.getElementsByTagName('a');

    for(var i = 0, a; a = anchors[i]; ++i){
        if(a.href.search(/youtube\.com\/watch\?v=/) == -1 || a.parentNode.className == "Quote") continue;

        if( a.classList.contains('youtube-converted') )
        {
            continue;
        }

        a.classList.add('youtube-converted');
        var id = (a.href.search(/&/) != -1) ? a.href.slice(a.href.search(/=/) + 1, a.href.search(/&/)) : a.href.slice(a.href.search(/=/) + 1);

        // <iframe src="http://www.youtube.com/embed/kJ1OdKdvg4g" height="480" width="640" allowfullscreen="" frameborder="0"></iframe>

        // http://img.youtube.com/vi/<insert-youtube-video-id-here>/default.jpg

        var child = $(a).children();

        var remove = false;

        if( child.length == 1 )
        {
            var src = $(child).attr('src');

            if( src !== undefined && src.indexOf( id ) !== -1 )
            {
                remove = true;
            }
        }

        var obj = document.createElement('p');
        obj.style = "padding: 0; margin: 0";

        var img = document.createElement('img');
        img.src = "http://img.youtube.com/vi/"+ id +"/hqdefault.jpg";
        img.width = 480;
        img.height = 360;
        img.setAttribute('style', 'border: 4px solid red;')

        obj.appendChild(img);

//        var iframe = document.createElement('iframe');
//        iframe.src = "http://www.youtube.com/embed/" + id;
//        iframe.height = 480;
//        iframe.width = 640;
//        iframe.setAttribute('allowfullscreen', true);
//        iframe.setAttribute('frameborder', 0);
//
//        obj.appendChild(iframe);

        insertAfter( obj, a );

        if( remove ){
            $(a).remove();
        }
    }
}

function main(){
    // If DOM changed
    document.addEventListener("DOMNodeInserted", handleVideo, false);

    function handleVideo(event) {

        var check = jQuery(event.target).find('a');

        if( check.length > 0 )
        {
            handle();
        }
    }

    handle();
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
