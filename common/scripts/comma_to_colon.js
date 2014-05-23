// ==UserScript==
// @name        comma_to_colon
// @namespace   leprosorium++comma_to_colon
// @author      ste-art
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// ==/UserScript==

function main() {

    var comma_to_colon = function() {
        var source = window.commentForm.prototype.show.toString().replace("this.container.getElement('textarea').value = this.options.comment_user_name ? this.options.comment_user_name + ', ' : '';","this.container.getElement('textarea').value = this.options.comment_user_name ? this.options.comment_user_name + ': ' : '';");
        eval('window.commentForm.prototype.show = ' + source);
    };

    var script = document.createElement('script'); 
    script.type = "text/javascript"; 
    script.innerHTML = "("+comma_to_colon.toString()+")()";
    document.getElementsByTagName('head')[0].appendChild(script);
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){
    var name = 'commatocolon';
    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});