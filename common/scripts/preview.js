// ==UserScript==
// @name		Leprosorium comments preview
// @namespace	leprosorium++preview
// @author	    Rpsl
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @require     zepto.js
// ==/UserScript==

function main(){

    function initPreview()
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

            var check = $(toolbar).find('a.textarea_preview');

            if( check.length == 0 ) {

                var d = document.createElement('a');
                d.setAttribute('style', "padding-left: 20px");
                var preview = document.createElement(window.location.href.indexOf("asylum") != -1 ? 'tr' : 'div');

                d.innerHTML = "<b>Предпросмотр<b>";
                d.href = "#";
                d.className = "b-textarea_editor_button b-textarea_editor_link textarea_preview";

                if (asylum) {
                    preview = document.createElement('tr');
                    preview.innerHTML = '<td colspan="3"><div style="margin-top:20px;" class="lp_preview"></div></td>';
                    //                toolbar.parentNode.parentNode.insertBefore(preview, toolbar.parentNode);
                    $(toolbar).parent().parent().append(preview);
                }
                else if ( inbox )
                {

                    preview = document.createElement('div');
                    preview.className = "lp_preview";
                    preview.setAttribute('style', "margin-top: 20px;");

                    $(toolbar).parent().after(preview);
                }
                else
                {
                    preview = document.createElement('div');
                    preview.className = "lp_preview";
                    preview.setAttribute('style', "margin-top: 20px;");

                    $(toolbar).parent().after(preview);
                }

                $(toolbar).append(d);
            }

        });

        $('.textarea_preview').on('click', function(e){

            if( asylum ) {
                var value = $(this).parent().parent().parent().find('textarea').val();
            } else {
                var value = $(this).parent().parent().find('textarea').val();
            }


            value = value
                .replace(/<irony>/g, '<span class=irony>')
                .replace(/<\/irony>/g, '</span>')
                .replace(/\n/g, '<br />');

            $(this).parent().parent().parent().find('.lp_preview').html( value );

            e.stopPropagation();
            e.preventDefault();
            return false;

        });
    }

    $('.c_answer').on('click',function(){
        initPreview();
    });

    initPreview();
}



kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'preview';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});