kango.ui.BrowserButton = function(a) {
    this.superclass.apply(this, arguments);
    var b = kango.utils.getDomainFromId(kango.getExtensionInfo().id);
    this._buttonId = "kango-ui-browserButton_" + b;
    this._popupId = "kango-ui-popup_" + b;
    this._popupFrameId = "kango-ui-popup-frame_" + b;
    this._canvasId = "kango-ui-canvas_" + b;
    this._imageContent = this._image = null;
    this._icon = a.icon || "";
    this._caption = a.caption || "";
    this._tooltipText = a.tooltipText || "";
    this._popupDetails = a.popup || null;
    this._badgeText = "";
    this._badgeBackgroundColor = this._badgeDefaultBackgroundColor;
    this._init()
};
kango.ui.BrowserButton.prototype = kango.oop.extend(kango.ui.ButtonBase, {
    _buttonId: null,
    _popupId: null,
    _popupFrameId: null,
    _canvasId: null,
    _icon: null,
    _caption: null,
    _tooltipText: null,
    _badgeBackgroundColor: null,
    _badgeDefaultBackgroundColor: [176, 0, 18, 255],
    _badgeText: null,
    _popupDetails: null,
    _image: null,
    _imageContent: null,
    _init: function() {
        kango.array.forEach(kango.chromeWindows.getLoadedChromeWindows(), function(a) {
            this._addXULElements(a)
        }, this);
        kango.chromeWindows.addEventListener(kango.chromeWindows.event.WINDOW_LOAD, kango.func.bind(function(a) {
                this._addXULElements(a.window)
            },
            this));
        kango.chromeWindows.addEventListener(kango.chromeWindows.event.WINDOW_UNLOAD, kango.func.bind(function(a) {
            this._removeXULElements(a.window)
        }, this))
    },
    dispose: function() {
        this.closePopup();
        this.removeAllEventListeners();
        this._destroyImage();
        this._removeCanvas();
        kango.array.forEach(kango.chromeWindows.getLoadedChromeWindows(), function(a) {
            this._removeXULElements(a)
        }, this)
    },
    _addXULElements: function(a) {
        this._insertPopupPanel(a);
        this._insertButton(a);
        var b = kango.func.bind(this._onAfterCustomization,
            this, a);
        a.addEventListener("aftercustomization", b, !1);
        kango.chromeWindows.registerContainerUnloader(function() {
            a.removeEventListener("aftercustomization", b, !1)
        }, a)
    },
    _removeXULElements: function(a) {
        this._removeButton(a);
        this._removePopupPanel(a)
    },
    _onAfterCustomization: function(a, b) {
        var c = this._getButtonElement(a);
        null != c && this._applyButtonProperties(c)
    },
    _destroyImage: function() {
        null != this._image && (this._image = this._image.onload = null)
    },
    _getCanvas: function() {
        var a = kango.chromeWindows.getHiddenWindow(),
            b = a.document.getElementById(this._canvasId);
        null == b && (b = a.document.createElementNS(XHTML_NS, "canvas"), b.setAttribute("id", this._canvasId));
        return b
    },
    _removeCanvas: function() {
        var a = kango.chromeWindows.getHiddenWindow().document.getElementById(this._canvasId);
        null != a && a.parentNode.removeChild(a)
    },
    _getButtonElement: function(a) {
        return a.document.getElementById(this._buttonId)
    },
    _getBackgroundColor: function(a) {
        return "rgba(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] / 255 + ")"
    },
    _applyButtonProperties: function(a) {
        a.setAttribute("label",
            this._caption);
        a.setAttribute("tooltiptext", this._tooltipText);
        a.setAttribute("image", this._imageContent || kango.io.getExtensionFileUrl(this._icon))
    },
    _insertButton: function(a) {
        a = a.document;
        var b = this._buttonId,
            c = a.createElement("toolbarbutton");
        c.setAttribute("id", b);
        c.setAttribute("type", "button");
        c.setAttribute("removable", "true");
        c.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
        this._applyButtonProperties(c);
        c.addEventListener("command", kango.func.bind(this._onCommand, this,
            a), !1);
        a.getElementById("navigator-toolbox").palette.appendChild(c);
        var c = a.getElementById("nav-bar"),
            e = c.getAttribute("currentset").split(","),
            f = e.indexOf(b);
        if (-1 == f) null == kango.systemStorage.getItem("ui.button_inserted") && (kango.systemStorage.setItem("ui.button_inserted", !0), c.insertItem(b), c.setAttribute("currentset", c.currentSet), a.persist(c.id, "currentset"));
        else {
            var d = null;
            f + 1 < e.length && (d = a.getElementById(e[f + 1]));
            null != d ? c.insertItem(b, d) : c.insertItem(b)
        }
    },
    _removeButton: function(a) {
        a = a.document.getElementById(this._buttonId);
        null != a && a.parentNode.removeChild(a)
    },
    _insertPopupPanel: function(a) {
        var b = a.document,
            c = b.getElementsByTagName("popupset")[0],
            e = b.createElement("panel");
        e.setAttribute("id", this._popupId);
        e.setAttribute("type", "arrow");
        e.setAttribute("level", "top");
        e.setAttribute("consumeoutsideclicks", "true");
        var f = '<bindings xmlns="http://www.mozilla.org/xbl"><binding id="id" extends="chrome://global/content/bindings/popup.xml#arrowpanel"><resources><stylesheet src="data:text/css;charset=utf-8,' + a.encodeURIComponent("* {padding: 0;} .panel-arrowcontent {background-color: white;}") +
            '"/></resources></binding></bindings>';
        e.style.MozBinding = 'url("data:text/xml;charset=utf-8,' + a.encodeURIComponent(f) + '")';
        var d = b.createElement("iframe");
        // var d = b.createElement("img");
        d.setAttribute("id", this._popupFrameId);
        d.setAttribute("flex", "1");
        d.setAttribute("transparent", "transparent");
        d.addEventListener("DOMContentLoaded", kango.func.bind(function(a) {
            a = a.target.defaultView.wrappedJSObject;
            a.kango = kango;
            this.fireEvent(this.event.POPUP_DOCUMENT_COMPLETE, {
                window: a
            })
        }, this), !0);
        e.appendChild(d);
        e.addEventListener("popuphidden",
            function() {
                d.setAttribute("src", "about:blank")
            }, !0);
        c.appendChild(e)
    },
    _removePopupPanel: function(a) {
        a = a.document.getElementById(this._popupId);
        null != a && a.parentNode.removeChild(a)
    },
    _onCommand: function(a, b) {
        var c = b.target;
        if (c.id == this._buttonId)
            if (null != this._popupDetails) {
                var e = a.getElementById(this._popupId),
                    f = this._popupDetails.url;
                0 != f.indexOf("http") && (f = kango.io.getExtensionFileUrl(f));
                var d = a.getElementById(this._popupFrameId);
                d.style.width = this._popupDetails.width + "px";
                d.style.height = this._popupDetails.height +
                    "px";
                d.setAttribute("src", f);
                e.openPopup(c, "bottomcenter topright", 0, 0, !1, null)
            } else this.fireEvent(this.event.COMMAND)
    },
    _updateEachButtonImage: function() {
        this._updateImage(kango.func.bind(function() {
            this._forEachButton(kango.func.bind(function(a) {
                a.image = this._imageContent
            }, this))
        }, this))
    },
    _forEachButton: function(a) {
        kango.array.forEach(kango.chromeWindows.getLoadedChromeWindows(), function(b) {
            var c = this._getButtonElement(b);
            null != c && a(c, b)
        }, this)
    },
    _updateImage: function(a) {
        this._destroyImage();
        var b =
            this._image = new(kango.chromeWindows.getHiddenWindow().Image);
        b.onload = kango.func.bind(function() {
            var c = b.width,
                e = b.height;
            if (19 < c || 19 < e) c = e = 19;
            var f = this._getCanvas(),
                d = f.getContext("2d");
            if ("" != this._badgeText) {
                d.font = "bold 11px Tahoma,arial,helvetica,sans-serif";
                f.width = 19;
                f.height = 19;
                var k = Math.round(d.measureText(this._badgeText).width);
                f.width = c + k + 2;
                f.height = e;
                d.drawImage(b, 0, 0, c, e);
                var l = this._getBackgroundColor(this._badgeBackgroundColor),
                    g = c + -4,
                    h = e - 11 - 1,
                    k = k + 6;
                d.beginPath();
                d.moveTo(g, h + 4);
                d.lineTo(g, h + 12 - 4);
                d.quadraticCurveTo(g, h + 12, g + 4, h + 12);
                d.lineTo(g + k - 4, h + 12);
                d.quadraticCurveTo(g + k, h + 12, g + k, h + 12 - 4);
                d.lineTo(g + k, h + 4);
                d.quadraticCurveTo(g + k, h, g + k - 4, h);
                d.lineTo(g + 4, h);
                d.quadraticCurveTo(g, h, g, h + 4);
                d.fillStyle = l;
                d.fill();
                d.font = "bold 11px Tahoma,arial,helvetica,sans-serif";
                d.textBaseline = "top";
                d.fillStyle = "white";
                d.fillText(this._badgeText, c + -4 + 2, e - 11)
            } else f.width = c, f.height = e, d.drawImage(b, 0, 0, c, e);
            this._imageContent = f.toDataURL("image/png");
            b.onload = null;
            a()
        }, this);
        b.src = kango.io.getExtensionFileUrl(this._icon)
    },
    _setTooltipText: function(a, b) {
        a.setAttribute("tooltiptext", b)
    },
    _setCaption: function(a, b) {
        a.setAttribute("label", b)
    },
    _setContextMenu: function(a, b, c, e) {
        b = b.document;
        var f = b.createElement("menupopup");
        f.setAttribute("id", a.id + "-menu");
        a.appendChild(f);
        b = b.createElement("menuitem");
        b.setAttribute("label", c);
        b.addEventListener("command", function(a) {
            e();
            a.preventDefault()
        }, !1);
        f.appendChild(b);
        a.addEventListener("contextmenu", function(b) {
            f.openPopup(a, "after_start", 0, 0, !0, !1);
            b.preventDefault()
        }, !1)
    },
    resizePopup: function(a,
        b) {
        var c = kango.chromeWindows.getMostRecentChromeWindow();
        if (null != c) {
            var e = c.document.getElementById(this._popupFrameId);
            c.document.getElementById(this._popupId);
            e.style.width = a + "px";
            e.style.height = b + "px"
        }
    },
    setTooltipText: function(a) {
        this._tooltipText = a;
        this._forEachButton(kango.func.bind(function(b) {
            this._setTooltipText(b, a)
        }, this))
    },
    setCaption: function(a) {
        this._caption = a;
        this._forEachButton(kango.func.bind(function(b) {
            this._setCaption(b, a)
        }, this))
    },
    setIcon: function(a) {
        "" != a && null != a ? this._icon !=
            a && (this._icon = a, this._updateEachButtonImage()) : this._forEachButton(kango.func.bind(function(a) {
                a.removeAttribute("image")
            }, this))
    },
    setBadgeValue: function(a) {
        a = null != a && 0 != a ? a.toString() : "";
        this._badgeText != a && (this._badgeText = a, this._updateEachButtonImage())
    },
    setBadgeBackgroundColor: function(a) {
        null != a && (kango.object.isArray(a) && 4 <= a.length) && (this._badgeBackgroundColor = a, this._updateEachButtonImage())
    },
    setPopup: function(a) {
        this._popupDetails = a
    },
    closePopup: function() {
        var a = kango.chromeWindows.getMostRecentChromeWindow();
        null != a && (a = a.document.getElementById(this._popupId), null != a && a.hidePopup())
    },
    setContextMenu: function(a, b) {
        this._forEachButton(kango.func.bind(function(c, e) {
            this._setContextMenu(c, e, a, b)
        }, this))
    }
});







kango.registerModule(function(a){var b=kango.getExtensionInfo();"undefined"!=typeof b.browser_button&&(a.ui.browserButton=new kango.ui.BrowserButton(b.browser_button),this.dispose=function(){"undefined"!=typeof a.ui.browserButton.dispose&&a.ui.browserButton.dispose();a.ui.browserButton=null})});
