// ==UserScript==
// @name		Lepra Scroll Extension
// @version		1
// @description	Добавляет полоску «Наверх» и подсвечивает автора поста.
// @author		boris_s
// @namespace	LepraScrollExt
// @include http://*.leprosorium.ru/*
// @include http://leprosorium.ru/*
// ==/UserScript==

function main() {


    var div = document.createElement('div'),
        offset,
        box,
        originalPostName,
        i = 2,
        len,
        head = document.getElementsByTagName('head')[0],
        style = document.createElement('style'),
        declarations = document.createTextNode('a.ophighlight { padding: 1px 3px 2px 3px; background-color: #ADC8E0; color: #ffffff; border-radius: 7px; text-decoration: none; } a.ophighlight:hover { color: #dddddd !important; } a.ophighlight:visited { color: #ffffff !important; }');

    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = declarations.nodeValue;
    } else {
        style.appendChild(declarations);
    }

    head.appendChild(style);

    function LepraScroll() {
        if (document.body.firstChild)
            document.body.insertBefore(div, document.body.firstChild);
        else
            document.body.appendChild(div);
        offset = 800;

        var obj = document.createElement('div');
        obj.setAttribute('style', 'position: absolute; top: ' + offset + 'px; left: -10px; width: 4%; height:' + (document.documentElement.scrollHeight - offset - 150) + 'px; background-color: #f8f8f8; cursor: pointer; opacity:0.4; border-right:1px solid #ddd;border-radius: 40px;z-index:1000');
        obj.setAttribute('onclick', 'scroll(0,0)');

        div.appendChild(obj);
    }

    LepraScroll();
    setInterval(LepraScroll, 10000);
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'leproscroll';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});