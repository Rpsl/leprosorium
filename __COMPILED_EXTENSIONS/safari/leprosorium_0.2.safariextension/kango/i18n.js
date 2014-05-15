kango.Internationalization=function(){this._loadLocales(this.getApplicationLocale())};
kango.Internationalization.prototype={_messages:null,_currentLocale:"en",_defaultLocale:"en",_loadLocales:function(a){var b=kango.getExtensionInfo();this._locales=b.locales||null;null!=this._locales&&(this._defaultLocale=b.default_locale||"en",this._currentLocale=null!=a&&""!=a?a.slice(0,2).toLowerCase():this._defaultLocale,this._messages={},a=this._getLocaleMessages(this._currentLocale),null!=a&&(this._messages[this._currentLocale]=a),this._currentLocale!=this._defaultLocale&&(this._messages[this._defaultLocale]=
this._getLocaleMessages(this._defaultLocale)))},_getLocaleMessages:function(a){a=kango.io.getExtensionFileContents("locales/"+a+".json");return null!=a&&""!=a?JSON.parse(a):null},getApplicationLocale:function(){return this._defaultLocale},getCurrentLocale:function(){return this._currentLocale},getMessages:function(){return null!=this._messages?"undefined"!=typeof this._messages[this._currentLocale]?this._messages[this._currentLocale]:this._messages[this._defaultLocale]:null},getMessage:function(a){var b=
this.getMessages(),b=null!=b&&"undefined"!=typeof b[a]?b[a]:a;return 1<arguments.length?kango.string.format.apply(kango.string,[b].concat(Array.prototype.slice.call(arguments,1))):b}};kango.registerModule(kango.getDefaultModuleRegistrar("i18n",kango.Internationalization));








kango.Internationalization.prototype.getApplicationLocale=function(){return window.navigator.language||null};
