var kango={event:{MESSAGE:"message"},registerModule:function(b,d){},lang:{evalInSandbox:function(b,d,c){for(var a in d)d.hasOwnProperty(a)&&(arguments.callee[a]=d[a]);(new Function("kango",c))(kango)},evalScriptsInSandbox:function(b,d,c){for(var a="",e=0;e<c.length;e++){for(var f=0;f<c[e].requires.length;f++)a+=c[e].requires[f].text+"\n\n";a+=c[e].text+"\n\n"}return this.evalInSandbox(b,d,a)}},browser:{getName:function(){return null}},console:{log:function(b){console.log(b)}},io:{},tab:{_isPrivate:!1,
isPrivate:function(){return this._isPrivate}},xhr:{send:function(b,d){var c=b.contentType;if("xml"==c||"json"==c)b.contentType="text";b.sanitizeData=!0;kango.invokeAsyncCallback("kango.xhr.send",b,function(a){if(""!=a.response&&null!=a.response)if("json"==c)try{a.response=JSON.parse(a.response)}catch(e){a.response=null}else if("xml"==c)try{var f=null,f="undefined"!=typeof DOMParser?DOMParser:window.DOMParser,g=new f;a.response=g.parseFromString(a.response,"text/xml")}catch(h){a.response=null}b.contentType=
c;d(a)})}},_init:function(b){"undefined"==typeof kango.dispatchMessage&&this._initMessaging();(new kango.UserscriptEngineClient).run(window,b,window==window.top)}};








kango.browser.getName=function(){return"safari"};kango.io.getResourceUrl=function(c){return safari.extension.baseURI+c};
kango._initMessaging=function(){var c=[];safari.self.addEventListener("message",function(a){a={name:a.name,data:a.message,origin:"background",source:kango,target:kango};for(var b=0;b<c.length;b++)c[b](a)});kango.dispatchMessage=function(a,b){safari.self.tab.dispatchMessage(a,b);return!0};kango.addEventListener=function(a,b){if("message"==a){for(var d=0;d<c.length;d++)if(c[d]==b)return;c.push(b)}};new kango.InvokeAsyncModule(kango);new kango.MessageTargetModule(kango)};
