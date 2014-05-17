KangoAPI.onReady(function() {

    var main_click = Options.getMainClick();

    jQuery('#on_button_click option').removeAttr('selected');
    jQuery('#on_button_click option[value="'+ main_click+'"]').attr('selected', 'selected');

    jQuery('#on_button_click').on('change', function() {
        Options.setMainClick( parseInt( jQuery('#on_button_click option:selected').val() ));
    });

    var on_badge = Options.getOnBadge();

    jQuery('#show_on_bage option').removeAttr('selected');
    jQuery('#show_on_bage option[value="'+ on_badge+'"]').attr('selected', 'selected');

    jQuery('#show_on_bage').on('change', function() {
        Options.setOnBadge( parseInt( jQuery('#show_on_bage option:selected').val() ));
        kango.dispatchMessage('refresh', true);
    });

    jQuery('input.plugin').on('change', function(){
        Options.setPlugin(jQuery(this).attr('id'), jQuery(this).is(':checked'));
    });

    var plugins = Options.getPlugins();

    for( var key in plugins ) {

        if( plugins[key] ) {
            jQuery('#' + key).attr('checked', 'checked' );
        } else {
            jQuery('#' + key).removeAttr('checked' );
        }
    };

    jQuery('.settings-block input[type="checkbox"]').on('change', function(e){

        e.preventDefault();

        var id = $(this).closest('.settings-block').attr('id');

        var value = $('#' + id +' input').serializeArray();

        if( value !== '[]' ) {
            kango.invokeAsync('kango.storage.setItem', id, value );
        } else {
            kango.invokeAsync('kango.storage.removeItem', id, value );
        }



    });

    jQuery('.settings-block').each(function(k,v){

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

    jQuery('a.settings').on('click', function(){
       $('#' + $(this).data('settings-block')).toggle();
    });

});
