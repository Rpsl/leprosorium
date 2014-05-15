kango.ui.BrowserButton=function(a){this.superclass.apply(this,arguments);chrome.browserAction.onClicked.addListener(kango.func.bind(this._onClicked,this));this._initDetails(a)};
kango.ui.BrowserButton.prototype=kango.oop.extend(kango.ui.ButtonBase,{_popupHostUrl:"kango-ui/remote_popup_host.html",_popupDetails:null,_onClicked:function(){return this.fireEvent(this.event.COMMAND)},_initDetails:function(a){kango.object.isObject(a)&&(kango.object.isString(a.icon)&&this.setIcon(a.icon),kango.object.isString(a.caption)&&this.setCaption(a.caption),kango.object.isString(a.tooltipText)&&this.setTooltipText(a.tooltipText),kango.object.isObject(a.popup)&&this.setPopup(a.popup))},setTooltipText:function(a){chrome.browserAction.setTitle({title:a.toString()})},
setCaption:function(a){},setIcon:function(a){chrome.browserAction.setIcon({path:kango.io.getFileUrl(a)})},setBadgeValue:function(a){chrome.browserAction.setBadgeText({text:null!=a&&0!=a?a.toString():""})},setBadgeBackgroundColor:function(a){chrome.browserAction.setBadgeBackgroundColor({color:a})},setPopup:function(a){this._popupDetails=a;var b="";null!=a&&kango.object.isString(a.url)&&(b=kango.io.isLocalUrl(a.url)?a.url:this._popupHostUrl);chrome.browserAction.setPopup({popup:b})},getPopupDetails:function(){return this._popupDetails},
setContextMenu:function(){}});








kango.registerModule(function(a){var b=kango.getExtensionInfo();"undefined"!=typeof b.browser_button&&(a.ui.browserButton=new kango.ui.BrowserButton(b.browser_button),this.dispose=function(){"undefined"!=typeof a.ui.browserButton.dispose&&a.ui.browserButton.dispose();a.ui.browserButton=null})});
