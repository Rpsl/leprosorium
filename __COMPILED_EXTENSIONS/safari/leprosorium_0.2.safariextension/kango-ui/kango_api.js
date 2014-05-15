var kango={event:{MESSAGE:"message"},registerModule:function(b,d){},lang:{evalInSandbox:function(b,d,c){for(var a in d)d.hasOwnProperty(a)&&(arguments.callee[a]=d[a]);(new Function("kango",c))(kango)},evalScriptsInSandbox:function(b,d,c){for(var a="",e=0;e<c.length;e++){for(var f=0;f<c[e].requires.length;f++)a+=c[e].requires[f].text+"\n\n";a+=c[e].text+"\n\n"}return this.evalInSandbox(b,d,a)}},browser:{getName:function(){return null}},console:{log:function(b){console.log(b)}},io:{},tab:{_isPrivate:!1,
isPrivate:function(){return this._isPrivate}},xhr:{send:function(b,d){var c=b.contentType;if("xml"==c||"json"==c)b.contentType="text";b.sanitizeData=!0;kango.invokeAsyncCallback("kango.xhr.send",b,function(a){if(""!=a.response&&null!=a.response)if("json"==c)try{a.response=JSON.parse(a.response)}catch(e){a.response=null}else if("xml"==c)try{var f=null,f="undefined"!=typeof DOMParser?DOMParser:window.DOMParser,g=new f;a.response=g.parseFromString(a.response,"text/xml")}catch(h){a.response=null}b.contentType=
c;d(a)})}},_init:function(b){"undefined"==typeof kango.dispatchMessage&&this._initMessaging();(new kango.UserscriptEngineClient).run(window,b,window==window.top)}};








kango.browser.getName=function(){return"safari"};kango.io.getResourceUrl=function(c){return safari.extension.baseURI+c};
kango._initMessaging=function(){var c=[];safari.self.addEventListener("message",function(a){a={name:a.name,data:a.message,origin:"background",source:kango,target:kango};for(var b=0;b<c.length;b++)c[b](a)});kango.dispatchMessage=function(a,b){safari.self.tab.dispatchMessage(a,b);return!0};kango.addEventListener=function(a,b){if("message"==a){for(var d=0;d<c.length;d++)if(c[d]==b)return;c.push(b)}};new kango.InvokeAsyncModule(kango);new kango.MessageTargetModule(kango)};
kango.InvokeAsyncModule=function(e){this.init(e)};
kango.InvokeAsyncModule.prototype.init=function(e){var g={},l=0,h=function(a){return"undefined"!=typeof a.call&&"undefined"!=typeof a.apply},m=function(a,b){var c={id:a.id,result:null,error:null};try{c.result=e.func.invoke(e.getContext(),a.method,a.params)}catch(d){var f=d.message;d.stack&&(f+="\nStack:\n"+d.stack);c.error=f;kango.console.log("Error during async call method "+a.method+". Details: "+f)}null!=a.id&&b.dispatchMessage("KangoInvokeAsyncModule_result",c)},n=function(a,b){var c={id:a.id,
result:null,error:null};try{a.params.push(function(d){c.result=d;null!=a.id&&b.dispatchMessage("KangoInvokeAsyncModule_result",c)}),e.func.invoke(e.getContext(),a.method,a.params)}catch(d){c.error=d.toString(),null!=a.id?b.dispatchMessage("KangoInvokeAsyncModule_result",c):kango.console.log("Error during async call method "+a.method+". Details: "+c.error)}},p=function(a,b){if("undefined"!=typeof a.id&&"undefined"!=typeof g[a.id]){var c=g[a.id];try{if(null==a.error&&h(c.onSuccess))c.onSuccess(a.result);
else if(h(c.onError))c.onError(a.error)}finally{delete g[a.id]}}};e.addEventListener("message",function(a){var b={};b.KangoInvokeAsyncModule_invoke=m;b.KangoInvokeAsyncModule_invokeCallback=n;b.KangoInvokeAsyncModule_result=p;var c=a.data,d;for(d in b)if(b.hasOwnProperty(d)&&d==a.name){b[d](c,a.source);break}});var k=function(a,b){b=Array.prototype.slice.call(b,0);var c=b[b.length-1],d={onSuccess:function(){},onError:function(a){kango.console.log("Error during async call method "+b[0]+". Details: "+
a)},isCallbackInvoke:a,isNotifyInvoke:!1};null!=c&&h(c)?(d.onSuccess=function(a){c(a)},b[b.length-1]=d):(d.isNotifyInvoke=!0,b.push(d));e.invokeAsyncEx.apply(e,b)};e.invokeAsyncEx=function(a){var b=arguments[arguments.length-1],c=b.isCallbackInvoke?"KangoInvokeAsyncModule_invokeCallback":"KangoInvokeAsyncModule_invoke",d=Array.prototype.slice.call(arguments,1,arguments.length-1),f=null;b.isNotifyInvoke||(f=(Math.random()+l++).toString(),g[f]=b);e.dispatchMessage(c,{id:f,method:a,params:d})};e.invokeAsync=
function(a){k(!1,arguments)};e.invokeAsyncCallback=function(a){k(!0,arguments)}};kango.registerModule(kango.InvokeAsyncModule);
kango.MessageTargetModule=function(e){this.init(e)};
kango.MessageTargetModule.prototype.init=function(e){var a={};e.addMessageListener=function(c,d){if("undefined"!=typeof d.call&&"undefined"!=typeof d.apply){a[c]=a[c]||[];for(var b=0;b<a[c].length;b++)if(a[c][b]==d)return!1;a[c].push(d);return!0}return!1};e.removeMessageListener=function(c,d){if("undefined"!=typeof a[c])for(var b=0;b<a[c].length;b++)if(a[c][b]==d)return a[c].splice(b,1),!0;return!1};e.removeAllMessageListeners=function(){a={}};e.addEventListener("message",function(c){var d=c.name;
if("undefined"!=typeof a[d])for(var b=0;b<a[d].length;b++){var e=!1;if("unknown"==typeof a[d][b].call)e=!0;else try{a[d][b](c)}catch(f){if(-2146828218==f.number||-2146823277==f.number)e=!0;else throw f;}e&&(a[d].splice(b,1),b--)}})};kango.registerModule(kango.MessageTargetModule);
(function(g){var h=function(a){var b=a.oop.createProxy(a),c=[];b.addMessageListener=function(a,d){return this.baseObject.addMessageListener(a,d)?(c.push({name:a,listener:d}),!0):!1};b.removeMessageListener=function(a,d){if(this.baseObject.removeMessageListener(a,d))for(var e=0;e<c.length;e++)if(c[e].name==a&&c[e].listener==d)return c.splice(e,1),!0;return!1};var f=function(){for(var b=0;b<c.length;b++)a.removeMessageListener(c[b].name,c[b].listener);c=[]};"undefined"!=typeof window.addEventListener?
window.addEventListener("unload",function(){f()},!1):window.attachEvent("onunload",function(){f()});return b};g.KangoAPI={_readyListeners:[],_readyFired:!1,createKangoProxy:function(a){return h(a)},onReady:function(a){this._readyFired?a():this._readyListeners.push(a)},closeWindow:function(){},resizeWindow:function(a,b){},fireReady:function(){for(var a=0;a<this._readyListeners.length;a++)this._readyListeners[a]();this._readyFired=!0}}})(window);








window.addEventListener("DOMContentLoaded",function(){"undefined"!=typeof safari.extension.globalPage?(window.kango=KangoAPI.createKangoProxy(safari.extension.globalPage.contentWindow.kango),KangoAPI.closeWindow=function(){kango.ui.browserButton.closePopup()},KangoAPI.resizeWindow=function(a,b){safari.self.width=a;safari.self.height=b}):(window.kango._initMessaging(),KangoAPI.closeWindow=function(){window.close()});KangoAPI.fireReady()},!1);
