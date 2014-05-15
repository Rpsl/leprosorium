﻿kango.UserscriptEngine=function(){this._scripts=[]};
kango.UserscriptEngine.prototype={_scripts:[],addScript:function(b,a,d){for(var c=0;c<this._scripts.length;c++)if(this._scripts[c].id==b)return!1;a=new kango.Userscript(a,d||null);this._loadRequiredFiles(a);this._scripts.push({id:b,script:a});return!0},removeScript:function(b){for(var a=0;a<this._scripts.length;a++)if(this._scripts[a].id==b)return this._scripts.splice(a,1),!0;return!1},clear:function(){this._scripts=[]},getScripts:function(b,a,d){for(var c={},e=0;e<this._scripts.length;e++){var f=
this._scripts[e].script,g=f.headers.namespace||"default",h=f.headers["run-at"]||"document-end",k=f.headers["all-frames"]||!1;if((d||!0==k)&&h==a&&this._isIncludedUrl(f,b)&&!this._isExcludedUrl(f,b))c[g]=c[g]||[],c[g].push({text:f.text,path:f.path,requires:f.requires})}return c},_loadRequiredFiles:function(b){if("undefined"!=typeof b.headers.require)for(var a=b.headers.require,d=0;d<a.length;d++){var c=a[d],e=kango.io.getExtensionFileContents(c);null!=e&&""!=e&&b.requires.push({text:e,path:kango.io.getExtensionFileUrl(c)})}},
_checkPatternArray:function(b,a){if("undefined"!=typeof b){b instanceof Array||(b=Array(b));for(var d=0;d<b.length;d++){var c=b[d].replace(/\*/g,"(.*)"),c=c.replace(/tld/g,"(.*)");if(RegExp(c).test(a))return!0}}return!1},_isIncludedUrl:function(b,a){return null==b.headers.include?!0:this._checkPatternArray(b.headers.include,a)},_isExcludedUrl:function(b,a){return null==b.headers.exclude?!1:this._checkPatternArray(b.headers.exclude,a)}};
kango.Userscript=function(b,a){this.text=b;this.path=a;this.headers={};this.requires=[];this._parseHeaders()};
kango.Userscript.prototype={headers:{},path:null,requires:[],text:"",_parseHeaders:function(){this.headers=this._parseHeadersToHashTable(this.text);"undefined"!=typeof this.headers.match&&("undefined"==typeof this.headers.include?this.headers.include=this.headers.match:this.headers.include.concat(this.headers.match))},_parseHeadersToHashTable:function(b){var a={};b=b.split(/\n/);for(var d=0;d<b.length;d++){var c=b[d];if(0==c.indexOf("// ==/UserScript=="))break;var e=c.match(/\/\/ @(\S+)\s*(.*)/);
if(null!=e)switch(c=e[1],e=e[2].replace(/\n|\r/g,""),c){case "include":case "exclude":case "match":case "require":a[c]=a[c]||[];a[c].push(e);break;case "all-frames":a[c]=/^true/i.test(e);break;default:a[c]=e}}return a}};kango.registerModule(function(b){b.userscript=new kango.UserscriptEngine;var a=kango.getExtensionInfo().content_scripts;if("undefined"!=typeof a)for(var d=0;d<a.length;d++){var c=kango.io.getExtensionFileContents(a[d]);null!=c&&""!=c&&b.userscript.addScript(a[d],c,kango.io.getExtensionFileUrl(a[d]))}});








kango.addEventListener(kango.event.READY,function(){var b=new kango.UserscriptEngineClient;kango.browser.addEventListener("DocumentLoaded",function(a){a=a.window;b.run(a,"document-end",a==a.top)});kango.browser.addEventListener("DocumentInserted",function(a){a=a.window;b.run(a,"document-start",a==a.top)})});
