// ==UserScript==
// @name 		LeproUserNumbers
// @author 		Din, al-dexter
// @version 		2.1
// @namespace 		http://leprosorium.ru/*
// @description   	Shows user numbers
// @include 		http://*leprosorium.ru/comments/*
// @include 		http://*leprosorium.ru/*
// @include 		http://*leprosorium.ru/users/*
// @require        jquery-1.9.1.min.js
// ==/UserScript==

function main()
{

//    appendUserNumbers(document.getElementsByClassName("ddi"));
//
//
//    // Appends user number after username in comment
//    function appendUserNumbers(ddis) {
//        //Adding user number
//        for (var i = 0; i < ddis.length; i++) {
//            var ddi = ddis[i];
//            var cUser = ddi.getElementsByClassName("c_user")[0];
//
//            //User number
//            var number = cUser.getAttribute("data-user_id");
//
//            //Creating new node
//            var numberElement = document.createElement("span");
//            numberElement.className="user_nu"
//            numberElement.innerHTML = " " + number.toString() + ", ";
//
//            //Appending to the lower line of comment
//            var jsDate = ddi.getElementsByClassName("js-date").item(0);
//            ddi.insertBefore(numberElement, jsDate);
//        }
//    }
//
//    // If DOM changed
//    document.addEventListener("DOMNodeInserted", makeNumbers, false);

    document.addEventListener("DOMNodeInserted", handleComment, false);

    function handleComment(event) {

        var check = jQuery(event.target).find('.ddi');

        if( check.length > 0 )
        {
            makeNumbers();
        }
    }


    makeNumbers();
}

function makeNumbers() {
    jQuery('.user_number').remove();

    jQuery('.ddi').each(function(k,v){
        var user_id = jQuery(this).find('.c_user').data('user_id');

        var obj = jQuery('<span></span>').addClass('user_number').html(' ' + user_id +', ');

        jQuery(this).find('.js-date').before( obj );
    });
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'usernumber';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
