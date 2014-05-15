(function(g){var h=function(a){var b=a.oop.createProxy(a),c=[];b.addMessageListener=function(a,d){return this.baseObject.addMessageListener(a,d)?(c.push({name:a,listener:d}),!0):!1};b.removeMessageListener=function(a,d){if(this.baseObject.removeMessageListener(a,d))for(var e=0;e<c.length;e++)if(c[e].name==a&&c[e].listener==d)return c.splice(e,1),!0;return!1};var f=function(){for(var b=0;b<c.length;b++)a.removeMessageListener(c[b].name,c[b].listener);c=[]};"undefined"!=typeof window.addEventListener?
window.addEventListener("unload",function(){f()},!1):window.attachEvent("onunload",function(){f()});return b};g.KangoAPI={_readyListeners:[],_readyFired:!1,createKangoProxy:function(a){return h(a)},onReady:function(a){this._readyFired?a():this._readyListeners.push(a)},closeWindow:function(){},resizeWindow:function(a,b){},fireReady:function(){for(var a=0;a<this._readyListeners.length;a++)this._readyListeners[a]();this._readyFired=!0}}})(window);








window.addEventListener("DOMContentLoaded",function(){window.kango=KangoAPI.createKangoProxy(chrome.extension.getBackgroundPage().kango);KangoAPI.closeWindow=function(){window.close()};KangoAPI.fireReady()},!1);
