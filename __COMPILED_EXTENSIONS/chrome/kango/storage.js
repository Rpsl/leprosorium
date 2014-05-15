kango.IStorage=function(){};kango.IStorage.prototype={setItem:function(a,b){throw new kango.NotImplementedException;},getItem:function(a){throw new kango.NotImplementedException;},removeItem:function(a){throw new kango.NotImplementedException;},getKeys:function(){throw new kango.NotImplementedException;},clear:function(){throw new kango.NotImplementedException;}};kango.JSONStorage=function(a){this._storageEngine=a};
kango.JSONStorage.prototype=kango.oop.extend(kango.IStorage,{_storageEngine:null,getItem:function(a){a=this._storageEngine.getItem(a);return"undefined"!=typeof a&&null!=a?JSON.parse(a):null},setItem:function(a,b){if("undefined"!=typeof b){var c=JSON.stringify(b);if("undefined"!=typeof c)return this._storageEngine.setItem(a,c)}else return this.removeItem(a);return!1},removeItem:function(a){return this._storageEngine.removeItem(a)},getKeys:function(){return this._storageEngine.getKeys()},clear:function(){return this._storageEngine.clear()},
dispose:function(){"undefined"!=typeof this._storageEngine.dispose&&this._storageEngine.dispose();this._storageEngine=null}});








kango.SYSTEM_STORAGE_PREFIX="{772ED927-1623-4E2C-94CC-D5E488E34C5B}_KangoSystemStorage.";kango.UserStorage=function(a){this._storageEngine=a};
kango.UserStorage.prototype=kango.oop.extend(kango.IStorage,{_storageEngine:null,getItem:function(a){return this._storageEngine.getItem(a)},setItem:function(a,b){return this._storageEngine.setItem(a,b)},removeItem:function(a){return this._storageEngine.removeItem(a)},clear:function(){return this._storageEngine.clear()},getKeys:function(){return kango.array.filter(this._storageEngine.getKeys(),function(a){return 0!=a.indexOf(kango.SYSTEM_STORAGE_PREFIX)})}});
kango.SystemStorage=function(a){this._storageEngine=a};
kango.SystemStorage.prototype=kango.oop.extend(kango.IStorage,{_storageEngine:null,getItem:function(a){return this._storageEngine.getItem(kango.SYSTEM_STORAGE_PREFIX+a)},setItem:function(a,b){return this._storageEngine.setItem(kango.SYSTEM_STORAGE_PREFIX+a,b)},removeItem:function(a){return this._storageEngine.removeItem(kango.SYSTEM_STORAGE_PREFIX+a)},clear:function(){return this._storageEngine.clear()},getKeys:function(){return kango.array.filter(this._storageEngine.getKeys(),function(a){return 0==
a.indexOf(kango.SYSTEM_STORAGE_PREFIX)})}});








kango.LocalStorage=function(){};kango.LocalStorage.prototype={getItem:function(a){return localStorage.getItem(a)},setItem:function(a,b){return localStorage.setItem(a,b)},removeItem:function(a){return localStorage.removeItem(a)},clear:function(){return localStorage.clear()},getKeys:function(){for(var a=localStorage.length,b=Array(a),c=0;c<a;c++)b[c]=localStorage.key(c);return b}};kango.registerModule(kango.getDefaultModuleRegistrar("storage",function(){return new kango.JSONStorage(new kango.UserStorage(new kango.LocalStorage))}));
kango.registerModule(kango.getDefaultModuleRegistrar("systemStorage",function(){return new kango.JSONStorage(new kango.SystemStorage(new kango.LocalStorage))}));
