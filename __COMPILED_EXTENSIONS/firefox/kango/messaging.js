kango.MessageRouter=function(){};kango.MessageRouter.prototype={_onMessage:function(a){kango.fireEvent(kango.event.MESSAGE,a)},dispatchMessage:function(a,b){var c={name:a,data:b,origin:"background",target:kango,source:kango};kango.timer.setTimeout(kango.func.bind(function(){this._onMessage(c)},this),1);return!0}};








kango.registerModule(function(a){var b=new kango.MessageRouter;a.dispatchMessage=function(a,c){b.dispatchMessage(a,c)};this.dispose=function(){b=a.dispatchMessage=null}});
