// ==UserScript==
// @name		Leprosorium youtube button
// @namespace	leprosorium++youtubebutton
// @author	    Rpsl
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @require     zepto.js
// ==/UserScript==

function main(){



    function youtube_parser(url){
//        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\?.*?v?=?([^#\&\?]*).*/;
        var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/i;
        var match = url.match(regExp);

        if (match&&match[2].length==11){
            return match[2];
        }else{
            return false;
        }
    }

    function initYouTubeButton()
    {
        var textarea = false;
        var toolbar = false;
        var asylum = false;
        var inbox = false;


        if( window.location.href.indexOf("write") !== -1)
        {
            textarea = $('textarea.i-form_textarea');
            inbox = true;

        }
        else if (window.location.href.indexOf("comments") !== -1 || window.location.href.indexOf("inbox") !== -1)
        {
            textarea = $('textarea.i-form_text_input');
        }
        else if (window.location.href.indexOf("asylum") != -1)
        {
            textarea = $('#js-new_post_body');
            asylum = true;
        }

        if( !textarea )
        {
            return false;
        }


        $(textarea).each(function(k,v){

            textarea = v;

            if( asylum )
            {
                toolbar = $(textarea).parent().parent().parent().find('#js-new_post_body_wysiwyg')
            }
            else if ( inbox )
            {
                toolbar = $(textarea).parent().find('#js-new_inbox_wysiwyg')
            }
            else
            {
                toolbar = $( textarea).parent().parent().find('.b-textarea_editor');
            }

            var check = $(toolbar).find('a.insert_youtube');

            if( check.length == 0 ) {

                var d = document.createElement('a');
                d.setAttribute('style', "padding-left: 20px");
                var preview = document.createElement(window.location.href.indexOf("asylum") != -1 ? 'tr' : 'div');

                d.innerHTML = "<b>YouTube<b>";
                d.href = "#";
                d.className = "b-textarea_editor_button b-textarea_editor_link insert_youtube";

                $(toolbar).append(d);
            }

        });

        $('.insert_youtube').off('click');
        $('.insert_youtube').on('click', function(e){


            var input = window.prompt("Ссылка на страницу YouTube","");

            if( input !== null ) {
                var id = youtube_parser( input ) ;

                if( id != false ) {
                    var template = '\n<a href="http://youtube.com/watch?v='+id+'"><img src="http://img.youtube.com/vi/'+id+'/hqdefault.jpg"></a>\n';

                    var text_form = undefined;

                    if( asylum ) {
                        text_form = $(this).parent().parent().parent().find('textarea');
                    } else {
                        text_form = $(this).parent().parent().find('textarea');
                    }

                    if( text_form != undefined ) {
                        var value = $(text_form).val();

                        value += template;

                        $(text_form).val(value);
                    }

                }
            }

            e.stopPropagation();
            e.preventDefault();
            return false;

        });
    }

    $('.c_answer').on('click',function(){
        initYouTubeButton();
    });

    initYouTubeButton();
}



kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'youtubebutton';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});