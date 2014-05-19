// ==UserScript==
// @name		Leprosorium scroll to top
// @namespace	leprosorium++scrolltotopv2
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// @require     jquery-1.9.1.min.js
// ==/UserScript==

function main(){

    jQuery('#js-content_aside_subsite').css({
        'background-color': 'white',
        'z-index': -1
    });

//    jQuery('.l-header_subsite').css({
//        'z-index': 2,
//        height: '100%',
//        'background-color': 'white'
//    });

    var scroll = jQuery('<div>&nbsp;</div>').attr('id', 'scroll_to_top').css({
            'background-color': "#f8f8f8",
            position: "fixed",
            width: "30px",
            height: "100%",
            left: "0px",
//        'z-index': 1,
            top:"1px",
            display: "none",
            cursor: "pointer",
            opacity:"0.4",
            'border-right':'1px solid #ddd'
        })
            .attr('onclick', 'scroll(0,0); return false;')
        ;

    var wrapper = jQuery('.l-i-content');

    if( wrapper.length = 1 )
    {
        wrapper = jQuery('.l-content');
    }

    if( wrapper.length = 1 ) {


        jQuery(wrapper).append(scroll);

        var last_pos = jQuery(document).scrollTop();

        jQuery(document).on('scroll', function () {

            var pos = jQuery(document).scrollTop()

            if ( last_pos > 800 && pos < 800 ) {
                jQuery(scroll).hide();
            } else if ( last_pos < 800 && pos > 800 ){
                jQuery(scroll).show();
            }

            last_pos = pos;

        });
    }
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'leproscroll';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});