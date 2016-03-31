KangoAPI.onReady(function() {

    loadPopup();

    function loadPopup()
    {
        var details = {
            url: 'https://leprosorium.ru/ajax/api/lepropanel',
            method: 'GET',
            async: true,
            contentType: 'json'
        };

        var cache_key = 'popup_data';

        kango.invokeAsync('kango.storage.getItem', cache_key, function(data) {
            // кэшируем ответ от api на две минуты

            if (data == null || (Math.round(+new Date() / 1000) - data.time) > 60 * 2) {

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

                        $('#loading').hide();
                        $('#shithappens').show();
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
        $('#karma').html( data.karma );

        $('#sklad').html( data.myunreadposts+'/'+ data.myunreadcomms );
        $('#inbox').html( data.inboxunreadposts +'/'+data.inboxunreadcomms  );

        $('#loading').hide();
        $('#success').show();

        var last_five = data.karmavotes.slice(Math.max(data.karmavotes.length - 5, 1)).reverse();

        var karma_title = '';

        $(last_five).each(function(k,v){
            karma_title += v.login +': '+v.attitude;

            if( k < 4 ){
                karma_title += '\x0A';
            }
        });

        var tr_karma = $('#tr_karma');

        tr_karma.attr('title', karma_title);

        tr_karma.on('click', function(){
            kango.browser.tabs.create({url: 'https://leprosorium.ru/'});
        });
        $('#tr_sklad').on('click', function(){
            kango.browser.tabs.create({url: 'https://leprosorium.ru/my/'});
        });
        $('#tr_inbox').on('click', function(){
            kango.browser.tabs.create({url: 'https://leprosorium.ru/my/inbox/'});
        });

        $('.settings').on('click', function(){
            kango.ui.optionsPage.open();
        });
    }


});