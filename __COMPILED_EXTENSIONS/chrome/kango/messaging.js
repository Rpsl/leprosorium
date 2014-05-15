kango.MessageRouter=function(){chrome.extension.onConnect.addListener(kango.func.bind(this._onConnect,this))};
kango.MessageRouter.prototype={_onConnect:function(a){var c=-1;"undefined"!=typeof a.sender.tab&&(c=a.sender.tab.id);kango.browser._registerPortForTab(c,a.name,a);a.onMessage.addListener(kango.func.bind(function(b){this._onMessage(b,a)},this));a.onDisconnect.addListener(function(){kango.browser._unregisterPortForTab(c,a.name)})},_onMessage:function(a,c){var b=c.sender,d={name:a.name,data:a.data,origin:a.origin,target:null,source:null};"tab"==a.origin&&(b=b.tab,"undefined"==typeof b&&(b={id:-1,url:"",
title:"Hidden Tab"}),d.source=new kango.BrowserTab(b,kango.browser._getPortsForTab(b.id)),d.target=d.source);kango.fireEvent(kango.event.MESSAGE,d)},dispatchMessage:function(a,c){var b={name:a,data:c,origin:"background",target:kango,source:kango};kango.timer.setTimeout(function(){kango.fireEvent(kango.event.MESSAGE,b)},1);return!0}};








kango.registerModule(function(a){var b=new kango.MessageRouter;a.dispatchMessage=function(a,c){b.dispatchMessage(a,c)};this.dispose=function(){b=a.dispatchMessage=null}});
