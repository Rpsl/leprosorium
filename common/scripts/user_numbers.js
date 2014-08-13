// ==UserScript==
// @name 		    LeproUserNumbers
// @author 		    Din, al-dexter, Rpsl
// @namespace 		http://leprosorium.ru/*
// @description   	Shows user numbers
// @include 		*leprosorium.ru/comments/*
// @include 		*leprosorium.ru/*
// @include 		*leprosorium.ru/users/*
// @include 		*leprosorium.com/comments/*
// @include 		*leprosorium.com/*
// @include 		*leprosorium.com/users/*
// ==/UserScript==

function main()
{
    commentsHandler();

    document.addEventListener("DOMNodeInserted", mutationHandler, false);
}

function commentsHandler()
{
    var ddis = document.getElementsByClassName('ddi');

    var i = 0;

    for( var dd in ddis )
    {
        if( ddis[dd].classList == undefined || ddis[dd].classList.contains('number') )
        {
            continue;
        }

        i++;

        number( ddis[dd] );

        if( i > 100 )
        {
            setTimeout(commentsHandler, 1000);

            return;
        }
    }
}


function mutationHandler(event)
{
    if( event.target.nodeName !== 'SPAN' && event.target.nodeName !== 'DIV' )
    {
        return false;
    }

    var check = event.target.getElementsByClassName('ddi');

    if( check.length > 0 )
    {
        for( var dd in check )
        {
            number( check[dd] );
        }

    }
}


function number( element )
{
    if( element.classList == undefined || element.classList.contains('number') )
    {
        return;
    }

    element.classList.add('number');

    var c_user = element.getElementsByClassName('c_user')[0];

    if( !c_user )
    {
        return;
    }

    var user_id = c_user.getAttribute('data-user_id');

    var obj = document.createElement('span');
        obj.className = "user_number";
        obj.textContent = ' ' + user_id;

    c_user.parentNode.insertBefore( obj, c_user.nextSibling );

//    c_user.textContent = c_user.textContent + '   [' + user_id + ']';
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'usernumber';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
