// ==UserScript==
// @name        comma_to_colon
// @namespace   leprosorium++comma_to_colon
// @author      Rpsl
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @require     zepto.min.js
// ==/UserScript==

function main() {

    $(document.body).on('click', '.c_answer', function(e){
        var self = this;

        setTimeout(function(e){
            var text = $(self).closest('.comment').find('.i-form_text_input').val();
            var to_user = $(self).closest('.comment').find('.c_user').text();

            if( text == to_user + ', ') {
                $(self).closest('.comment').find('.i-form_text_input').val(to_user + ': ');
            }
        }, 50);
    });

}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){
    var name = 'commatocolon';
    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});