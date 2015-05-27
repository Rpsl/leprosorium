KangoAPI.onReady(function() {

    var browser = kango.browser.getName();

    // safari умеет показывать только целые числа на бейдже
    // поэтому уберем из вариантов выбора суммарные
    if( browser == 'safari' ) {
        $('#sob_8').remove();
        $('#sob_7').remove();
    }

    var on_bage_obj = $('#show_on_bage');


    kango.invokeAsync('kango.storage.getItem', 'main::badge', function(value){

        if (value == undefined) {
            value = 0;
        }

        $(on_bage_obj).find('option').removeAttr('selected');
        $(on_bage_obj).find('option[value="'+ value +'"]').attr('selected', 'selected');

    });


    $(on_bage_obj).on('change', function() {

        var value = parseInt( $(on_bage_obj).find('option:checked').val() )

        // этооо чтоооо хоооть такооое тоооо????
        if (value !== 0 && value !== 1 && value !== 2 && value !== 3 && value !== 4 && value !== 5 && value !== 6 && value !== 7 && value !== 8) {
            value = 0;
        }

        kango.invokeAsync('kango.storage.setItem', 'main::badge', value );
        kango.dispatchMessage('refresh', true);
    });


    $('input.plugin').on('change', function(){

        var name = $(this).attr('id');
        var onoff = $(this).is(':checked');

        kango.invokeAsync('kango.storage.getItem', 'plugins', function(settings){

            if (onoff) {
                onoff = 1;
            } else {
                onoff = 0;
            }

            if (settings == undefined || settings == null) {
                settings = {};
            }

            settings[name] = onoff;

            kango.invokeAsync('kango.storage.setItem', 'plugins', settings );
        });

    });

    kango.invokeAsync('kango.storage.getItem', 'plugins', function(settings){

        if (settings == undefined || settings == null) {
            settings = {};
        }

        for( var key in settings ) {

            if( settings[key] ) {
                $('#' + key).attr('checked', 'checked' );
            } else {
                $('#' + key).removeAttr('checked' );
            }
        }
    });

    $('.settings-block input[type="checkbox"]').on('change', function(e){

        e.preventDefault();

        var id = $(this).closest('.settings-block').attr('id');

        var value = $('#' + id +' input').serializeArray();

        if( value !== '[]' ) {
            kango.invokeAsync('kango.storage.setItem', id, value );
        } else {
            kango.invokeAsync('kango.storage.removeItem', id, value );
        }



    });

    $('.settings-block').each(function(k,v){

        var id = $(this).attr('id');

        kango.invokeAsync('kango.storage.getItem', id,  function(value){

            if( value !== undefined && value !== null ) {
                $(value).each(function(k,v){

                    var $el = $('[name="'+ v.name+'"]'),
                        type = $el.attr('type');

                    switch(type){
                        case 'checkbox':
                            $el.attr('checked', 'checked');
                            break;
                        case 'radio':
                            $el.filter('[value="'+v.value+'"]').attr('checked', 'checked');
                            break;
                        default:
                            $el.val(v.value);
                    }

                });
            }

        });
    });

    $('a.settings').on('click', function(){
       $('#' + $(this).data('settings-block')).toggle();
    });

});
