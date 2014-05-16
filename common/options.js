var Options = {
    init: function(){

    },

    getMainClick: function( ){

        var out = kango.storage.getItem('main::click');

        if( out == undefined ){
            out = 1;
        }

        return out;
    },

    setMainClick: function( value ){
        if( value !== 0 && value !== 1 ) {
            value = 1;
        }
        kango.invokeAsync('kango.storage.setItem', 'main::click', value );
    },

    getOnBadge: function(){
        var out = kango.storage.getItem('main::badge');

        if( out == undefined ) {
            out = 0;
        }

        return out;
    },

    setOnBadge: function( value ){
        if( value !== 0 && value !== 1 && value !== 2 && value !== 3 && value !== 4 && value !== 5 && value !== 6 )
        {
            value = 0;
        }

        kango.invokeAsync('kango.storage.setItem', 'main::badge', value );
    },

    isPluginOn: function( name ) {

        var settings = Options.getPlugins()

        name = name.replace(/[^a-zA-Z ]/g, "")

        if( settings[ name ] == undefined || settings[ name ] == null )
        {
            return false;
        }

        return settings[ name ];

    },

    getPlugins: function(){

        var out = kango.storage.getItem('plugins');

        if( out == undefined || out == null ){
            out = {};
        }

        return out;
    },

    setPlugin: function( name, value ){

        var settings = Options.getPlugins()

        if( value ){
            value = 1;
        } else {
            value = 0;
        }

        settings[name] = value;

        kango.storage.setItem('plugins', settings );
    }
};

