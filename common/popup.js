KangoAPI.onReady(function() {


//    var main_click = kango.storage.getItem('main::click');
//
//    if( main_click == 1 ) {
//
//        var is_opened = false;
//
//        kango.browser.windows.getCurrent(function (win) {
//            win.getTabs(function (tabs) {
//                jQuery.each(tabs, function (k, v) {
//                    if (v.getUrl() == 'http://leprosorium.ru/') {
//                        is_opened = true;
//                    }
//
//                });
//
//                if (!is_opened) {
//                    kango.invokeAsync('kango.browser.tabs.create', {url:'http://leprosorium.ru/', focused: false} );
//
//
//                }
//            });
//        });
//    }

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
            if (data == null || (Math.round(+new Date() / 1000) - data.time) > 60 * 2) {
                kango.console.log('request');
                kango.console.log(data);

                kango.xhr.send(details, function (data) {
                    if (data.status == 200 && data.response != null) {
                        // kango.console.log( data );

                        var data = {
                            karma: data.response.karma,
                            myunreadposts: data.response.myunreadposts,
                            myunreadcomms: data.response.myunreadcomms,
                            inboxunreadposts: data.response.inboxunreadposts,
                            inboxunreadcomms: data.response.inboxunreadcomms
                        };

                        setPopupData(data);

                        kango.invokeAsync('kango.storage.setItem', cache_key, { time: Math.round(+new Date() / 1000), data: data });

                    }
                    else {
                        // shit happens

                        jQuery('#loading').hide();
                        jQuery('#shithappens').show();
                    }
                });
            }
            else {
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

        jQuery('#tr_karma').on('click', function(){
            kango.browser.tabs.create({url: 'http://leprosorium.ru/'});
        });
        jQuery('#tr_sklad').on('click', function(){
            kango.browser.tabs.create({url: 'http://leprosorium.ru/my/'});
        });
        jQuery('#tr_inbox').on('click', function(){
            kango.browser.tabs.create({url: 'http://leprosorium.ru/my/inbox/'});
        });
    }


});