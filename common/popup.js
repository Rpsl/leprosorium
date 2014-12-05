KangoAPI.onReady(function() {

    loadPopup();

    function loadPopup()
    {
        var details = {
            url: 'http://leprosorium.ru/api/lepropanel',
            method: 'GET',
            async: true,
            contentType: 'json'
        };

        var cache_key = 'popup_data';

        var self = this;

        kango.invokeAsync('kango.storage.getItem', cache_key, function(data) {
            // кэшируем ответ от api на две минуты

            // TODO
            if (1<2||data == null || (Math.round(+new Date() / 1000) - data.time) > 60 * 2) {

                kango.xhr.send(details, function (data) {
                    if (data.status == 200 && data.response != null) {

                        var my_data = {
                            karma: data.response.karma,
                            karmavotes: data.response.karma_votes,
                            myunreadposts: data.response.myunreadposts,
                            myunreadcomms: data.response.myunreadcomms,
                            inboxunreadposts: data.response.inboxunreadposts,
                            inboxunreadcomms: data.response.inboxunreadcomms
                        };

                        setPopupData(my_data);

                        kango.invokeAsync('kango.storage.setItem', cache_key, { time: Math.round(+new Date() / 1000), data: my_data });

                    } else {
                        // shit happens

                        jQuery('#loading').hide();
                        jQuery('#shithappens').show();
                    }
                });

            } else {
                kango.console.log('from cache');
                kango.console.log((Math.round(+new Date() / 1000) - data.time));

                setPopupData(data.data);
            }
        });
    }


    function setPopupData( data )
    {
        jQuery('#karma').html( data.karma );

        jQuery('#sklad').html( data.myunreadposts+'/'+ data.myunreadcomms );
        jQuery('#inbox').html( data.inboxunreadposts +'/'+data.inboxunreadcomms  );

        jQuery('#loading').hide();
        jQuery('#success').show();

        data.karmavotes = [];

        var last_five = data.karmavotes.slice(Math.max(data.karmavotes.length - 5, 1)).reverse();

        var karma_title = '';

        jQuery(last_five).each(function(k,v){
            karma_title += v.login +': '+v.attitude;

            if( k < 4 ){
                karma_title += '\x0A';
            }
        });

        console.log( karma_title );

        var tr_karma = jQuery('#tr_karma');

        tr_karma.attr('title', karma_title);

        tr_karma.on('click', function(){
            kango.browser.tabs.create({url: 'http://leprosorium.ru/'});
        });
        jQuery('#tr_sklad').on('click', function(){
            kango.browser.tabs.create({url: 'http://leprosorium.ru/my/'});
        });
        jQuery('#tr_inbox').on('click', function(){
            kango.browser.tabs.create({url: 'http://leprosorium.ru/my/inbox/'});
        });

        jQuery('.settings').on('click', function(){
            kango.ui.optionsPage.open();
        });

        // &#013;
    }


});