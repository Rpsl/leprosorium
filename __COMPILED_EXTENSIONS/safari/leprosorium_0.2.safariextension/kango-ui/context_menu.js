kango.ui.ContextMenuItem=function(a){this.superclass.apply(this,arguments);this.init(a)};
kango.ui.ContextMenuItem.prototype=kango.oop.extend(kango.ui.ContextMenuItemBase,{init:function(a){this.addItem("item1",a.caption,a.context||"all")},addItem:function(a,c,d){safari.application.addEventListener("contextmenu",kango.func.bind(function(b){b.contextMenu.appendContextMenuItem(a,c)},this),!1);safari.application.addEventListener("command",kango.func.bind(function(b){b.command==a&&this.fireEvent(this.event.CLICK,{})},this),!1)}});








kango.registerModule(function(a){var b=kango.getExtensionInfo();"undefined"!=typeof b.context_menu_item&&(a.ui.contextMenuItem=new kango.ui.ContextMenuItem(b.context_menu_item),this.dispose=function(){"undefined"!=typeof a.ui.contextMenuItem.dispose&&a.ui.contextMenuItem.dispose();a.ui.contextMenuItem=null})});
