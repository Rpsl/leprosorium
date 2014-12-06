function Lepro() {
    var self = this;
    self.refresh();

    window.setInterval(function() {
        self.refresh()
    }, self._refreshTimeout);
}

Lepro.prototype = {

    _refreshTimeout: 60*1000*5, // 5 mins
    _feedUrl: 'https://leprosorium.ru/api/lepropanel',

    _setUnreadCount: function(data) {

        kango.console.log( data );

        kango.invokeAsync('kango.storage.getItem', 'main::badge', function( badge ){

            var string = '';
            var count = 0;

            switch( badge )
            {
                case 1:
                    string = 'Карма';
                    count = data.response.karma;
                    break;
                case 2:
                    string = 'Рейтинг';
                    count = data.response.rating;
                    break;
                case 3:
                    string = "Посты";
                    count = data.response.myunreadposts;
                    break;
                case 4:
                    string = "Комменты";
                    count = data.response.myunreadcomms;
                    break;
                case 5:
                    string = "Инбоксы";
                    count = data.response.inboxunreadposts;
                    break;
                case 6:
                    string = "В инбоксах";
                    count = data.response.inboxunreadcomms;
                    break;
                case 7:
                    string = "Инбокс";
                    count = 0;

                    if( data.response.inboxunreadposts > 0 || data.response.inboxunreadcomms > 0)
                    {
                        count = data.response.inboxunreadposts + '/' +data.response.inboxunreadcomms;
                    }

                    break;

                case 8:
                    string = "Мои вещи";
                    count = 0;

                    if( data.response.myunreadposts > 0 || data.response.myunreadcomms > 0)
                    {
                        count = data.response.myunreadposts + '/' +data.response.myunreadcomms;
                    }

                    break;


                default:
                    string = '';
                    count = 0;

            }

            var split = string + ': ' + count;

            if( badge == 0 || count == 0 )
            {
                split = ''
            }

            kango.ui.browserButton.setTooltipText( split );
            kango.ui.browserButton.setIcon('icons/button.png');
            kango.ui.browserButton.setBadgeValue(count);



        });

    },

    refresh: function() {
        var details = {
            url: 'https://leprosorium.ru/api/lepropanel',
            method: 'GET',
            async: true,
            contentType: 'json'
        };

        var self = this;


        kango.xhr.send(details, function(data) {
            if (data.status == 200 && data.response != null) {

                self._setUnreadCount(data);
            }
        });

        kango.invokeAsync('kango.storage.getItem', 'firstview', function(value) {

            if( value !== 1 ){
                kango.storage.setItem('firstview', 1);

                kango.ui.optionsPage.open();
            }

        });



    }

};

var extension = new Lepro();

kango.addMessageListener('refresh', function(event) {
    extension.refresh();
});