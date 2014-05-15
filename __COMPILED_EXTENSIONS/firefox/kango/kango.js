(function(){kango.oop.mixin(kango,kango.EventTarget.prototype);kango.oop.mixin(kango,new kango.EventTarget);kango.oop.mixin(kango,{CONFIG_FILE_NAME:"extension_info.json",event:{READY:"Ready",ASYNC_MODULE_INITIALIZED:"AsyncModuleInitialized",MESSAGE:"message",UNINSTALL:"Uninstall"},_extensionInfo:null,_eventState:0,_modulesToInit:[],_modules:[],_asyncModules:[],_initModules:function(){kango.array.forEach(this._modulesToInit,function(a){a=new a(this);this._modules.push(a)},this);this._modulesToInit=
[]},init:function(a){this._extensionInfo=a;var e=!1;this.addEventListener(this.event.ASYNC_MODULE_INITIALIZED,kango.func.bind(function(a){for(var b=0;b<this._asyncModules.length;b++)if(a.data==this._asyncModules[b]){this._asyncModules.splice(b,1);break}e&&0==this._asyncModules.length&&this.fireEvent(this.event.READY)},this));this._initModules();e=!0;0==this._asyncModules.length&&this.fireEvent(this.event.READY)},dispose:function(){this.removeAllEventListeners();kango.array.forEach(this._modules.reverse(),
function(a){"undefined"!=typeof a.dispose&&a.dispose()},this);this._modules=[]},registerModule:function(a){this._modulesToInit.push(a)},registerAsyncModuleInitializer:function(a){this._asyncModules.push(a)},getDefaultModuleRegistrar:function(a,e){return function(c){c=kango.object.resolveOrCreateName(c,a);var b=c.parent,d=c.terminalName;b[d]=new e;this.dispose=function(){"undefined"!=typeof b[d].dispose&&b[d].dispose();b[d]=null}}},getAliasModuleRegistrar:function(a,e){return function(c){var b=kango.object.resolveOrCreateName(c,
a),d=b.parent,f=b.terminalName;c=kango.object.resolveName(c,e);d[f]=c.parent[c.terminalName];this.dispose=function(){d[f]=null}}},getExtensionInfo:function(){return kango.object.clone(this._extensionInfo)},getContext:function(){var a=kango.backgroundScript.getContext();return a?a:kango.lang.getGlobalContext()},isDebug:function(){var a=this.getExtensionInfo();return"undefined"!=typeof a.debug&&a.debug}})})();








kango.TabProxyTab=function(a){this._tab=a};kango.TabProxyTab.prototype={_tab:null,isPrivate:function(){return this._tab.isPrivate()}};kango.TabProxy=function(a){this.tab=new kango.TabProxyTab(a);this._tab=a;this._listeners=[];this._invokeAsyncModule=new kango.InvokeAsyncModule(this);this._messageTargetModule=new kango.MessageTargetModule(this)};
kango.TabProxy.prototype={_tab:null,_listeners:null,_invokeAsyncModule:null,_messageTargetModule:null,xhr:{send:function(){return null!=kango?kango.xhr.send.apply(kango.xhr,arguments):null}},console:{log:function(){return null!=kango?kango.console.log.apply(kango.console,arguments):null}},browser:{getName:function(){return null!=kango?kango.browser.getName():null}},io:{getResourceUrl:function(a){return null!=kango?kango.io.getResourceUrl(a):null}},event:{MESSAGE:"message"},dispatchMessage:function(a,
c){if(null!=kango){var b={name:a,data:c,origin:"tab",source:this._tab,target:this._tab};kango.timer.setTimeout(function(){kango.fireEvent(kango.event.MESSAGE,b)},1);return!0}return!1},addEventListener:function(a,c){if("message"==a){for(var b=0;b<this._listeners.length;b++)if(this._listeners[b]==c)return;this._listeners.push(c)}},fireEvent:function(a,c){if("message"==a){c.source=c.target=this;for(var b=0;b<this._listeners.length;b++)this._listeners[b](c)}}};








kango.TabProxyTab.prototype.__exposedProps__={isPrivate:"r"};kango.TabProxy.prototype.__exposedProps__={xhr:"r",console:"r",browser:"r",io:"r",event:"r",tab:"r",invokeAsync:"r",invokeAsyncCallback:"r",dispatchMessage:"r",addMessageListener:"r",removeMessageListener:"r",removeAllMessageListeners:"r"};kango.TabProxy.prototype.xhr.__exposedProps__={send:"r"};
kango.TabProxy.prototype.xhr.send=function(b,c){kango.xhr.send(b,function(a){a.__exposedProps__={response:"rw",status:"r"};""!=a.response&&null!=a.response&&"json"==b.contentType&&kango.lang.makeDataExposed(a.response);c(a)})};kango.TabProxy.prototype.console.__exposedProps__={log:"r"};kango.TabProxy.prototype.browser.__exposedProps__={getName:"r"};kango.TabProxy.prototype.io.__exposedProps__={getResourceUrl:"r"};kango.TabProxy.prototype.event.__exposedProps__={MESSAGE:"r"};
