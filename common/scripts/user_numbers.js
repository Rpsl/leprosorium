// ==UserScript==
// @name 		LeproUserNumbers
// @author 		Din, al-dexter
// @version 		2.1
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
    document.addEventListener("DOMNodeInserted", handleComment, false);

    function handleComment(event) {

        try
        {
            var check = event.target.getElementsByClassName('ddi');
        }
        catch (e)
        {
            return;
        }


        if( check.length > 0 )
        {
            makeNumbers();
        }
    }


    makeNumbers();
}

function makeNumbers() {
    var ddis = document.getElementsByClassName('ddi');

    for( var dd in ddis )
    {

        if( ddis[dd].classList == undefined || ddis[dd].classList.contains('number') )
        {
            continue;
        }

        ddis[dd].classList.add('number');

        var c_user = ddis[dd].getElementsByClassName('c_user')[0];

        var user_id = c_user.getAttribute('data-user_id');

        var obj = document.createElement('span');
            obj.className = "user_number";
            obj.textContent = ' ' + user_id;

        c_user.parentNode.insertBefore( obj, c_user.nextSibling );
    }
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'usernumber';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
