kango.MessageRouter=function(){safari.application.addEventListener("message",kango.func.bind(this._onMessage,this),!1)};
kango.MessageRouter.prototype={_onMessage:function(a){if(a.target instanceof SafariBrowserTab){var b={name:a.name,data:a.message,origin:"tab",target:kango.browser.getKangoTab(a.target),source:{dispatchMessage:function(b,d){a.target.page.dispatchMessage(b,d);return!0}}};kango.fireEvent(kango.event.MESSAGE,b)}else kango.console.log("Messaging supported only for SafariBrowserTab targets")},dispatchMessage:function(a,b){var c={name:a,data:b,origin:"background",source:kango,target:kango};kango.timer.setTimeout(function(){kango.fireEvent(kango.event.MESSAGE,
c)},1);return!0}};








kango.registerModule(function(a){var b=new kango.MessageRouter;a.dispatchMessage=function(a,c){b.dispatchMessage(a,c)};this.dispose=function(){b=a.dispatchMessage=null}});
