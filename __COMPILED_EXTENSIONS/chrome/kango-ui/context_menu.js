kango.ui.ContextMenuItem=function(a){this.superclass.apply(this,arguments);this.init(a)};kango.ui.ContextMenuItem.prototype=kango.oop.extend(kango.ui.ContextMenuItemBase,{init:function(a){this.addItem("item1",a.caption,a.context||"all")},addItem:function(a,b,c){a={title:b,contexts:[c]};a.onclick=kango.func.bind(function(a,b){this.fireEvent(this.event.CLICK,{srcUrl:a.srcUrl,linkUrl:a.linkUrl})},this);return chrome.contextMenus.create(a)}});








kango.registerModule(function(a){var b=kango.getExtensionInfo();"undefined"!=typeof b.context_menu_item&&(a.ui.contextMenuItem=new kango.ui.ContextMenuItem(b.context_menu_item),this.dispose=function(){"undefined"!=typeof a.ui.contextMenuItem.dispose&&a.ui.contextMenuItem.dispose();a.ui.contextMenuItem=null})});
