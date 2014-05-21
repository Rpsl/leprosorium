// ==UserScript==
// @name		Leprosorium youtube link converter
// @namespace	leprosorium++youtubelinks
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// ==/UserScript==
'use strict';

function main() {

    function onLoad() {
        cfg.load();
        var q = 'a[href*="//t.co/"]';
        for (var sid in sites) {
            q += sites[sid].patterns.reduce(function (prev, cur) {
                return prev + ',a[href*="' + cur + '"]';
            }, '');
        }
        links.query = q;
        links.process(d.body);
        var M = window.MutationObserver || window.WebKitMutationObserver;
        if (M) {
            new M(onMutations).observe(d.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['href']
            });
        } else {
            d.body.addEventListener('DOMNodeInserted', onNodeInserted, false);
        }
        // GM_registerMenuCommand('Set up YouTube Link Title', setup.show);
    }

    function onNodeInserted(e) {
        var t = e.target;
        if (t.nodeType == 1) window.setTimeout(links.process, 100, t);
    }

    function onMutations(muts) {
        for (var i = muts.length, m; i-- && (m = muts[i]);) {
            if (m.type == 'attributes') {
                window.setTimeout(links.process, 100, m.target);
            } else {
                for (var j = m.addedNodes.length, node; j-- && (node = m.addedNodes[j]);) {
                    if (node.nodeType == 1) window.setTimeout(links.process, 100, node);
                }
            }
        }
    }

    function ce(n, props) {
        var n = d.createElement(n);
        if (props) {
            forEach(props, function (p) {
                if (p == 'click' || p == 'mousedown' || p == 'mousedown') {
                    n.addEventListener(p, props[p], false);
                } else {
                    n[p] = props[p];
                }
            });
        }
        return n;
    }

    function forEach(o, f) {
        var props = Object.keys(o);
        for (var i = props.length, p; i-- && (p = props[i]);) {
            if (o.hasOwnProperty(p)) f(p);
        }
    }

    function rm(id) {
        var node = $(id);
        if (node) node.parentNode.removeChild(node);
    }

    var d = document,
        $ = function (id) {
            return d.getElementById(id);
        };

    var setup = {
        id: 'YTLT-setup',
        html: function () {
            var h = '<div>YouTube Link Title</div><ul>';
            this.forEach(function (n) {
                var s = cfg.settings[n];
                if (typeof s.
                        default == 'boolean') {
                    h += '<li><input type="checkbox" name="' + n + '"> ' + s.title + '</li>'
                } else if (s.options) {
                    h += '<li>' + s.title + ': <select name="' + n + '">';
                    forEach(s.options, function (on) {
                        h += '<option value="' + on + '">' + s.options[on] + '</option>';
                    });
                    h += '</select></li>';
                }
            });
            return h += '</ul><div><button name="save">Save settings</button></div></div>';
        },
        q: function (n) {
            return d.querySelector('#' + this.id + ' *[name="' + n + '"]');
        },
        get: function (n) {
            var s = cfg.settings[n];
            if (typeof s.
                    default == 'boolean') return this.q(n).checked;
            if (s.options) {
                var sel = this.q(n);
                return sel.options[sel.selectedIndex].value;
            }
        },
        set: function (n, val) {
            var s = cfg.settings[n];
            if (typeof s.
                    default == 'boolean') {
                this.q(n).checked = val;
            } else if (s.options) {
                var sel = this.q(n);
                for (var i = sel.options.length; i--;) {
                    if (sel.options[i].value == val) sel.selectedIndex = i;
                }
            }
        },
        forEach: function (f) {
            forEach(cfg.settings, function (n) {
                if (cfg.settings[n].title) f(n);
            });
        },
        show: function () {
            rm(setup.id);

            var styl = document.createElement('style');

            GM_addStyle('\
                #' + setup.id + ' { position:fixed;z-index:10001;top:40px;right:40px;padding:20px 30px;background-color:white;width:auto;border:1px solid black }\
                #' + setup.id + ' * { color:black;text-align:left;line-height:normal;font-size:12px }\
                #' + setup.id + ' div { text-align:center;font-weight:bold;font-size:14px }\
                #' + setup.id + ' ul { margin:15px 0 15px 0;padding:0;list-style:none }\
                #' + setup.id + ' li { margin:0;padding:3px 0 3px 0;vertical-align:middle }');
            d.body.appendChild(ce('div', {
                id: setup.id,
                innerHTML: setup.html()
            }));
            setup.q('save').addEventListener('click', function () {
                setup.forEach(function (n) {
                    cfg[n] = setup.get(n);
                });
                cfg.x = cfg.y = false;
                cfg.save();
                this.disabled = true;
                this.innerHTML = 'Reloading...';
                window.location.reload();
            }, false);
            setup.forEach(function (n) {
                setup.set(n, cfg[n]);
                setup.q(n).addEventListener('change', setup.update, false);
            });
            setup.update();
        },
        update: function () {
            setup.forEach(function (n) {
                var s = cfg.settings[n];
                if (!s.depends) return;
                setup.q(n).parentNode.style.display = (Object.keys(s.depends).every(function (dn) {
                    return s.depends[dn].test(setup.get(dn));
                })) ? '' : 'none';
            });
        }
    }

    var links = {
        process: function (node) {
            var i = 0,
                list = node.tagName.toUpperCase() == 'A' ? [node] : node.querySelectorAll(links.query),
                isFB = location.hostname == 'www.facebook.com';
            if (list.length < 1) return;

            function processChunk() {
                var a, li, vi, num = 0,
                    ae = d.activeElement;
                while (a = list[i++]) {
                    if (!(li = links.parseInfo(a)) || ae && ae != d.body && ae.contains(a) || isFB && a.parentNode.outerHTML.indexOf('shareLink') > -1) continue;
                    if ((vi = cache.get(li.sid, li.vid)) || cfg.urls_only && !li.url) {
                        links.decorate(a, li, vi);
                    } else {
                        (function (a, li) {
                            net.info(li, function (vi) {
                                links.decorate(a, li, vi);
                            });
                        })(a, li);
                    }
                    if (++num == 15) return window.setTimeout(processChunk, 100);
                }
                list = null;
            }

            node = null;
            processChunk();
        },
        parseInfo: function (a) {
            var url = a.getAttribute('data-expanded-url') || a.getAttribute('data-full-url') || a.href;
            try {
                url = decodeURIComponent(url.replace(/^https?:\/\/www\.facebook\.com\/.+(http.+)/, '$1'));
            } catch (ex) {
            }
            ;
            var test = function (pattern) {
                return this.indexOf(pattern.toLowerCase()) != -1;
            };
            for (var sid in sites) {
                var s = sites[sid],
                    info;
                if (!sites[sid].patterns.some(test, url.toLowerCase())) continue;
                if (info = sites[sid].parse(url)) return {
                    sid: sid,
                    vid: info.vid,
                    t: info.t,
                    url: sites[sid].patterns.some(test, a.textContent.toLowerCase()),
                    oUrl: url
                };
            }
            return null;
        },
        decorate: function (a, li, vi) {
            if (a.className.indexOf('YTLT-') > -1) {
                a.removeEventListener('click', this.onClick, false);
                a.removeEventListener('mouseover', this.onMouseOver, false);
            } else {
                if (!this.styleAdded) {
                    var css = '\
                        #YTLT-preview { position:fixed;z-index:8888;width:320px;padding:0;border:1px solid black;background-color:black; }\
                        #YTLT-preview img { max-height:240px;width:inherit;vertical-align:bottom; }\
                        #YTLT-preview div { padding:4px 2px;width:316px;text-align:center;font-family:sans-serif;font-size:13px;color:white;font-weight:bold; }\
                        a.YTLT-na { text-decoration: line-through!important; }\
                        a.YTLT-text { font-weight:bold!important;font-style:italic!important; }\
                        a.YTLT-icon { padding-left:18px!important; }\
                        a.YTLT-icon.YTLT-na:hover, a.YTLT-icon.YTLT-ne:hover { background:transparent url(data:image/gif;base64,R0lGODlhEAAQAKIGAO/v7+vr676+vmVlZZqamv///////wAAACH5BAEAAAYALAAAAAAQABAAAAM/aLrc/tAIQisRj4DCOSAZN4xDATpEV4zmMlVdWZ6GxqWr2Cq4mau0nk0VCHZelsuiBwypbpkNkcZAWjCRrCIBADs=) center left no-repeat!important; }';
                    for (var sid in sites) {
                        css += 'a.YTLT-icon-' + sid + ' { background:transparent url(' + sites[sid].icon + ') center left no-repeat!important; }';
                    }
                    GM_addStyle(css);
                    this.styleAdded = true;
                }
                var c = ' YTLT-link';
                if (li.url || window.location.hostname == 'twitter.com') {
                    c += ' YTLT-text YTLT-icon YTLT-icon-' + li.sid;
                    if (vi) a.innerHTML = vi.title;
                } else {
                    if (vi && !cfg.previews && vi.title) a.title = vi.title;
                    if (a.hasChildNodes() && a.innerHTML.indexOf('<img') == -1 && a.textContent.trim()) {
                        c += ' YTLT-icon YTLT-icon-' + li.sid;
                    }
                }
                if (vi.status == 3 || vi.status == 4) {
                    c += ' YTLT-na';
                } else if (vi.status == 5) {
                    c += ' YTLT-ne';
                }
                a.className += c;
                if (cfg.rewrite && sites[li.sid].url) {
                    a.href = sites[li.sid].url(li.vid, li.t, li.oUrl);
                }
            }
            if (cfg.embed_mode != 'off') {
                a.target = '_blank';
                if (!vi.status) a.addEventListener('click', this.onClick, false);
            }
            if (cfg.previews && (vi && vi.preview || sites[li.sid].preview) && !a.querySelector('iframe')) {
                a.addEventListener('mouseover', this.onMouseOver, false);
                new Image().src = embedding.preview(vi, li);
            }
        },
        onClick: function (e) {
            if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || e.button != 0) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            rm('YTLT-preview');
            embedding.play(this);
        },
        onMouseOver: function (e) {
            rm('YTLT-preview');
            var li = links.parseInfo(this);
            var vi = cache.get(li.sid, li.vid);
            var qm = d.compatMode == 'BackCompat';
            var w = qm ? d.body.clientWidth : d.documentElement.clientWidth,
                h = qm ? d.body.clientHeight : d.documentElement.clientHeight;
            var img = ce('img', {
                src: embedding.preview(vi, li)
            });
            var div = ce('div', {
                id: 'YTLT-preview'
            });
            div.appendChild(img);
            if (vi.title && this.textContent.indexOf(vi.title) == -1) div.appendChild(ce('div', {
                innerHTML: vi.title
            }));
            d.body.appendChild(div);
            var r = (this.firstElementChild || this).getBoundingClientRect();
            var dw = Math.max(div.offsetWidth, 320),
                dh = Math.max(div.offsetHeight, 240);
            if (h - r.height > 2 * dh) {
                if (r.top + r.bottom > h) {
                    div.style.bottom = h - r.top + 15 + 'px';
                } else {
                    div.style.top = r.bottom + 15 + 'px';
                }
                div.style.left = Math.min(w - dw - 10, Math.max(10, e.pageX - dw / 2)) + 'px';
            } else {
                if (r.right + r.left > w) {
                    div.style.right = w - r.right + r.width + 15 + 'px';
                } else {
                    div.style.left = r.left + r.width + 15 + 'px';
                }
                if (r.top + r.bottom > h) {
                    div.style.bottom = Math.max(20, h - r.top - r.height / 2 - dh / 2) + 'px';
                } else {
                    div.style.top = Math.max(10, r.top + r.height / 2 - dh / 2) + 'px';
                }
            }
            this.addEventListener('mouseout', links.onMouseOut, false);
        },
        onMouseOut: function (e) {
            this.removeEventListener('mouseout', links.onMouseOut, false);
            rm('YTLT-preview');
        }
    };

    var net = {
        info: function (li, f) {
            var id = li.sid + li.vid;
            if (typeof net.pending[id] != 'object') {
                net.pending[id] = [f];
                sites[li.sid].request(li.vid, function (vi) {
                    if (vi) {
                        cache.set(li.sid, li.vid, vi);
                        for (var i = net.pending[id].length; i--;) {
                            window.setTimeout(net.pending[id][i], 0, vi);
                        }
                    }
                    delete net.pending[id];
                });
            } else {
                net.pending[id].push(f);
            }
        },
        pending: {},
        json: function (url, f) {

            kango.xhr.send({
                method: "GET",
                url: url
            }, function (data) {
                if (data.status == 200 && data.response != null) {
                    var obj;
                    try {
                        obj = JSON.parse(data.response);
                    } catch (ex) {
                        console.log('JSON data from ' + url + ' could not be parsed: ' + ex + '\nHTTP: ' + req.status + '\nResponse: ' + data.response);
                    }
                    window.setTimeout(f, 0, data.status, obj, data.response);
                } else {
                    console.log('Request to ' + url + ' failed.');
                }
            });
        },
        text: function (url, re, f) {
            kango.xhr.send({
                method: "GET",
                url: url
            }, function (data) {
                if (data.status == 200 && data.response != null) {
                    var m = [],
                        txt = req.responseText;
                    for (var i = 0, len = re.length; i < len; i++) {
                        m.push(re[i].exec(txt));
                    }
                    window.setTimeout(f, 0, req.status, m);
                } else {
                    console.log('Request to ' + url + ' failed.');
                }
            });
        }
    };

    var embedding = {
        play: function (a) {
            var li = links.parseInfo(a);
            if (cfg.embed_mode == 'inline') {
                var embed = embedding.embed(li, cfg.big);
                a.parentNode.replaceChild(embed, a);
                window.setTimeout(window.scrollTo, 0, 0, window.scrollY + embed.getBoundingClientRect().top - window.innerHeight / 2 + embed.offsetHeight / 2);
            } else if (cfg.embed_mode == 'window') {
                var embed = embedding.embed(li, cfg.big);
                var w = parseInt(embed.style.width),
                    h = parseInt(embed.style.height);
                embed.style.width = '100%';
                embed.style.height = '100%';
                var div = ce('div');
                div.appendChild(embed);
                var features = 'left=' + (window.screen.width / 2 - w / 2) + ',top=' + (window.screen.height / 2 - h / 2) + ',width=' + w + ',height=' + h + ',status=no,scrollbars=no,location=no,menubar=no,toolbar=no,personalbar=no,dependent=no';
                window.open('data:text/html,<html><title>Video Player</title><body style="padding:0;margin:0;overflow:hidden;background:black">' + encodeURIComponent(div.innerHTML) + '</body></html>', 'YouTube Link Title', features);
                div.removeChild(embed);
            } else if (cfg.embed_mode == 'player') {
                popup.close();
                popup.show(li);
            }
        },
        embed: function (li, big) {
            var site = sites[li.sid];
            var embed = ce('iframe', {
                src: site.embed(li.vid, li.t),
                className: 'YTLT-embed'
            });
            embed.setAttribute('webkitAllowFullScreen', '');
            embed.setAttribute('allowfullscreen', '');
            embed.setAttribute('YTLT-sid', li.sid);
            embedding.resize(embed, big);
            embed.style.display = 'block';
            return embed;
        },
        resize: function (embed, big) {
            var site = sites[embed.getAttribute('YTLT-sid')];
            var w = site.sizes[big ? 1 : 0][0];
            var h = site.sizes[big ? 1 : 0][1];
            embed.style.width = w + 'px';
            embed.style.height = h + 'px';
        },
        preview: function (vi, li) {
            if (vi && vi.preview) {
                return vi.preview;
            } else if (sites[li.sid].preview) {
                return sites[li.sid].preview(li.vid);
            }
        }
    };

    var popup = {
        show: function (li) {
            if (!this.styleAdded) {
                GM_addStyle('\
                    #YTLT-bg { position:fixed;z-index:9999;top:0;right:0;bottom:0;left:0;background-color:black;opacity:0.9; }\
                    #YTLT-player { display:block;position:fixed;z-index:10000;line-height:normal;background-color:black;border:2px solid black;font-size:13px;line-height:16px;padding:0;margin:0;left:auto;top:auto;right:auto;bottom:auto; }\
                    #YTLT-player-titlebar { display:block;line-height:17px;padding:0;background:#1b1b1b;border-bottom:2px solid black;text-align:' + (cfg.reverse_buttons ? 'left' : 'right') + '; }\
                    #YTLT-player-darken { padding:0px 11px 3px 11px; }\
                    #YTLT-player-resize { padding:1px 11px 2px 11px; }\
                    #YTLT-player-close { padding:0px 28px 3px 28px; }\
                    #YTLT-player .YTLT-embed { border:0;line-height:normal; }\
                    #YTLT-player .YTLT-player-titlebar-button { vertical-align:top;display:inline-block;margin:0;font-weight:bold;font-size:14px;text-decoration:none;border:0;border-' + (cfg.reverse_buttons ? 'right' : 'left') + ':2px solid black;color:#757575;text-decoration:none;cursor:pointer;font-family:"segoe ui",verdana,sans-serif; }\
                    #YTLT-player .YTLT-player-titlebar-button:hover { color:#959595!important; }\
                    .YTLT-embed { display:block;background-color:black;border:2px solid black;margin:0;padding:0;transition-property:width,height;transition-duration:500ms;transition-timing-function:ease; }\
                    #YTLT-player.YTLT-player-moving { opacity:0.8;cursor:move;border:2px solid white; }\
                    #YTLT-player.YTLT-player-moving .YTLT-embed { visibility:hidden; }\
                    .YTLT-noselect { -moz-user-select:none;-webkit-user-select:none;-o-user-select:none; }');
                this.styleAdded = true;
            }
            this.li = li;
            var titlebar = ce('div', {
                id: 'YTLT-player-titlebar',
                mousedown: this.onTitlebarMouseDown
            });
            var buttons = [
                ce('a', {
                    id: 'YTLT-player-darken',
                    className: 'YTLT-player-titlebar-button YTLT-noselect',
                    innerHTML: '&#9788;',
                    click: this.onDarkenClick
                }),
                ce('a', {
                    id: 'YTLT-player-resize',
                    className: 'YTLT-player-titlebar-button YTLT-noselect',
                    click: this.onResizeClick
                }),
                ce('a', {
                    id: 'YTLT-player-close',
                    className: 'YTLT-player-titlebar-button YTLT-noselect',
                    innerHTML: 'X',
                    click: this.onCloseClick
                })
            ];
            if (cfg.reverse_buttons) buttons.reverse();
            for (var i = 0; i < buttons.length; i++) {
                titlebar.appendChild(buttons[i]);
            }
            var player = ce('div', {
                id: 'YTLT-player'
            });
            player.appendChild(titlebar);
            player.appendChild(embedding.embed(li, cfg.big));
            d.body.appendChild(player);
            this.update();
            var w = player.offsetWidth,
                h = player.offsetHeight;
            var x = parseFloat(cfg.x),
                y = parseFloat(cfg.y);
            var qm = d.compatMode == 'BackCompat';
            var cw = qm ? d.body.clientWidth : d.documentElement.clientWidth;
            var ch = qm ? d.body.clientHeight : d.documentElement.clientHeight;
            var mx = cw - x - w / 2;
            var isPosValid = mx > 0 && mx < cw && y > -5 && y < ch - h / 2;
            player.style.right = (isPosValid ? x : 80) + 'px';
            player.style.top = (isPosValid ? y : ch / 2 - h / 2) + 'px';
            if (cfg.darken) d.body.appendChild(ce('div', {
                id: 'YTLT-bg'
            }));
            d.addEventListener('keydown', this.onKeyDown, false);
        },
        close: function () {
            rm('YTLT-player');
            rm('YTLT-bg');
            d.removeEventListener('keydown', popup.onKeyDown, true);
        },
        update: function (e) {
            $('YTLT-player-resize').innerHTML = cfg.big ? '&#65293;' : '&#65291;';
        },
        onCloseClick: function (e) {
            e.preventDefault();
            popup.close();
        },
        onResizeClick: function (e) {
            e.preventDefault();
            cfg.big = !cfg.big;
            cfg.save();
            var embed = d.body.querySelector('#YTLT-player .YTLT-embed');
            embedding.resize(embed, cfg.big);
            popup.update();
        },
        onDarkenClick: function (e) {
            if ($('YTLT-bg')) {
                rm('YTLT-bg');
                cfg.darken = false;
                cfg.save();
            } else {
                d.body.appendChild(ce('div', {
                    id: 'YTLT-bg'
                }));
                cfg.darken = true;
                cfg.save();
            }
        },
        onKeyDown: function (e) {
            if (e.keyCode == 27) popup.close();
        },
        onTitlebarMouseDown: function (e) {
            var t = e.target;
            if (t.id != 'YTLT-player-titlebar') return;
            t.parentNode.className = 'YTLT-player-moving';
            var r = t.getBoundingClientRect();
            t.dx = e.clientX - r.left;
            t.dy = e.clientY - r.top;
            d.body.className += ' YTLT-noselect';
            window.addEventListener('mousemove', popup.onTitlebarMouseMove, false);
            window.addEventListener('mouseup', popup.onTitlebarMouseUp, false);
        },
        onTitlebarMouseMove: function (e) {
            var titlebar = $('YTLT-player-titlebar');
            titlebar.parentNode.style.right = (d.compatMode == 'BackCompat' ? d.body.clientWidth : d.documentElement.clientWidth) - e.clientX - titlebar.offsetWidth + titlebar.dx - 2 + 'px';
            titlebar.parentNode.style.top = e.clientY - titlebar.dy - 2 + 'px';
        },
        onTitlebarMouseUp: function (e) {
            var titlebar = $('YTLT-player-titlebar');
            titlebar.parentNode.className = '';
            titlebar.dx = null;
            titlebar.dy = null;
            window.removeEventListener('mousemove', popup.onTitlebarMouseMove, false);
            window.removeEventListener('mouseup', popup.onTitlebarMouseUp, false);
            d.body.className = d.body.className.replace('YTLT-noselect', '');
            cfg.x = parseInt(titlebar.parentNode.style.right);
            cfg.y = titlebar.parentNode.style.top;
            cfg.save();
        }
    };

    var sites = {
        'yt': {
            patterns: ["youtube.com", "youtu.be", "youtube.googleapis.com"],
            parse: function (url) {
                return /^https?:\/\/((www\.|m\.)?you.+v[=\/]|#p\/[a-z]\/.+\/|youtu\.be\/)([a-z0-9_-]+)(.*[#&\?]t=([0-9hms]+))?/i.exec(url) ? {
                    vid: RegExp.$3,
                    t: RegExp.$5
                } : null;
            },
            sizes: [
                [640, 390],
                [853, 510]
            ],
            embed: function (vid, t) {
                var m = /((\d+)h)?((\d+)m)?(\d+)?/.exec(t);
                t = parseInt(m[2] || 0) * 3600 + parseInt(m[4] || 0) * 60 + parseInt(m[5] || 0);
                return 'https://www.youtube.com/embed/' + vid + '?autoplay=1&rel=1' + (t ? '&start=' + t : '');
            },
            url: function (vid, t, oUrl) {
                return 'https://www.youtube.com/watch?v=' + vid + (/\b(list=[a-z0-9_-]+)/i.exec(oUrl) ? '&' + RegExp.$1 : '') + (t ? '#t=' + t : '');
            },
            preview: function (vid) {
                return 'https://img.youtube.com/vi/' + vid + '/0.jpg';
            },
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAMZQTFRFkQ0IyBILyBILkQ0IyBILkQ0IkQ0IyBILyBILkQ0IpA8JmQ4JlQ4Ing4JuxEKtRAKwBEKxBELyBILkQ0IAAAA+fn5wRcQtR0Yvh8YqRsWrx0XoxsV56Wj8vLy9+/vyTMttxgS252b6Ojo0WNfnRcTy8jIlg4JzL+/XAgFjjAtdAoHiFNRmA4IbxQQgQwI05qYmw4JrI2M8fHx1dXV5+fn3d3dkQ0IpA8JtRAKyBILng4Jqg8JrxAKuxEKmQ4JwBEKxBELlQ4ItxbjVAAAABV0Uk5TCaUJBvmihNKi2PzMh+rq/MyHzMwAD5S0KQAAAItJREFUGNOFz8cWgjAARNGxKx2CvWDvFRILCuj//5QJcYMuvKt3Zjdwv+BnyOec4u2j4lRd2M8MG1bCNXpeIlkwIq5VH0yilAHzyjV9vz8aijLxEDqU0vEhTdyFNmNssUoTyoXrBsFptxWlQA+56WyzPooIdagxN1/uY0mF9srQgBIhZ6lGSLmAv2/fr2gov1/MElQAAAAASUVORK5CYII=',
            request: function (vid, f) {
                net.json('https://gdata.youtube.com/feeds/api/videos/' + vid + '?alt=json&fields=title/text(),yt:noembed,app:control/yt:state/@reasonCode', function (code, obj, txt) {
                    if (code == 404 && txt.indexOf('Video not found') != -1) {
                        window.setTimeout(f, 0, {
                            title: 'Video not found',
                            status: 4
                        });
                    } else if (code == 403 && txt.indexOf('Private video') != -1) {
                        window.setTimeout(f, 0, {
                            title: 'Private video',
                            status: 3
                        });
                    } else if (code == 200 && obj) {
                        var entry = obj.entry;
                        var title = entry.title.$t;
                        var status;
                        if (entry.app$control && entry.app$control.yt$state && entry.app$control.yt$state.reasonCode && entry.app$control.yt$state.reasonCode != 'limitedSyndication') {
                            status = 3;
                        } else if (typeof entry.yt$noembed == 'object') {
                            status = 5;
                        }
                        window.setTimeout(f, 0, {
                            title: title,
                            status: status
                        });
                    } else {
                        window.setTimeout(f, 0);
                    }
                });
            }
        },
        'vm': {
            patterns: ["vimeo.com"],
            parse: function (url) {
                return /^https?:\/\/vimeo\.com\/(m\/)?([0-9]+)/i.exec(url) ? {
                    vid: RegExp.$2
                } : null;
            },
            sizes: [
                [640, 360],
                [853, 480]
            ],
            embed: function (vid, t) {
                return 'https://player.vimeo.com/video/' + vid + '?title=1&portrait=1&byline=1&color=aa0000&autoplay=1';
            },
            url: function (vid, t) {
                return 'https://vimeo.com/' + vid;
            },
            icon: 'data:image/gif;base64,R0lGODlhEAAQAMQfAAuUuQynzzu83u/09Ryy2Su320rC4IbW6mKOngqHq5GvuoO3xhVbc0m92zV7keDo60R8j8Hc5KHEzwuawGSluaTg8Ah1lfD5/BmPsJPI13fR6LLd6f///wuavg2t1gAAACH5BAEAAB8ALAAAAAAQABAAAAVu4NeNZFmKgqeurCqMbbzCbrEWh0ao9MFdNgNnWOF1CJUhR+PZDIYRY2MRGWYIFsVQYgRYHNBAc4gwqiaPoUfIkQDMKsnwkB5YZp0VRTmEsGgeGHwIb3grAVoDCAktgB4WEAyMjY4AYpQiJpojHyEAOw==',
            request: function (vid, f) {
                net.json('https://vimeo.com/api/oembed.json?url=http://vimeo.com/' + vid, function (code, obj) {
                    if (code == 404) {
                        window.setTimeout(f, 0, {
                            title: 'Video not found',
                            status: 4
                        });
                    } else if (code == 403) {
                        window.setTimeout(f, 0, {
                            title: 'Unknown video',
                            status: 5
                        });
                    } else if (code == 200 && obj) {
                        window.setTimeout(f, 0, {
                            title: obj.title ? obj.title : 'Unknown video',
                            preview: obj.thumbnail_url
                        });
                    } else {
                        window.setTimeout(f, 0);
                    }
                });
            }
        },
        'vn': {
            patterns: ["vine.co"],
            parse: function (url) {
                return /^https?:\/\/(www\.)?vine\.co\/v\/([a-z0-9]+)/i.exec(url) ? {
                    vid: RegExp.$2
                } : null;
            },
            sizes: [
                [500, 500],
                [660, 660]
            ],
            embed: function (vid, t) {
                return 'https://vine.co/v/' + vid + '/card?mute=0';
            },
            url: function (vid, t) {
                return 'https://vine.co/v/' + vid;
            },
            icon: 'data:image/gif;base64,R0lGODlhEAAQALMAAAqnfLXk1/b7+jS1ks3t5JvZyFbBpOf28onSvhirhHLLswCjdgCkdwCjd////wCkeCH5BAAAAAAALAAAAAAQABAAAARp8Mk5TQgoNbqrcGCgMQZiUISDHcK5IE4xDezQBI6yvOpcPzjdwtCbBAEpF+1gkygchIEis0kkdwwr1DUpFCUDnOAgHI6bTtABQcGJGA1tYeTJSWBMLAU//ZQ5AF4fMQCAe36FhhQGXBQRADs=',
            request: function (vid, f) {
                net.text('https://vine.co/v/' + vid, [/"og:title" content="(.+?)">/, /"og:image" content="(.+?)"/], function (code, m) {
                    var title = m[0],
                        preview = m[1];
                    if (code == 404) {
                        window.setTimeout(f, 0, {
                            title: 'Video not found',
                            status: 4
                        });
                    } else {
                        window.setTimeout(f, 0, {
                            title: title ? title[1] : 'Unknown video',
                            preview: preview ? preview[1] : null
                        });
                    }
                });
            }
        },
        'cb': {
            patterns: ["coub.com/view/"],
            parse: function (url) {
                return /^https?:\/\/coub\.com\/view\/([a-z0-9]+)/i.exec(url) ? {
                    vid: RegExp.$1
                } : null;
            },
            sizes: [
                [640, 360],
                [853, 480]
            ],
            embed: function (vid, t) {
                return 'http://coub.com/embed/' + vid + '?muted=false&autostart=true&noSiteButtons=true';
            },
            url: function (vid, t) {
                return 'http://coub.com/view/' + vid;
            },
            icon: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAWlBMVEUAAAADM/8AIP8DMv8AK/8DMv8DMv8AMP8EMv8EMv8EM/8DMv////8UQP+Dmv9kgf/t8P/M1v/j6f8dSP96k//Z4f+Mov/Bzf8MOf+0wv87X/91j/+Yq/9rhv9szalUAAAACnRSTlMAvwjCBpSYKo/huP286QAAAHpJREFUGNNlj9sSgyAMRGkrBQ4R1Kq9//9vCiqOo+ctmWx2V2WMdd47a9RCpVm5X+f5wsatSgvNDp30QD02ItKMDzDKprmVto+hkwhWOQjyfuW7bw1OeXjKh4I/LthL+ixZnw4hhkH+YBfb0GXbX7Y9BjtFP5cr9Sn1JyOZCa2SfTdfAAAAAElFTkSuQmCC',
            request: function (vid, f) {
                net.json('http://coub.com/api/oembed.json?url=http://coub.com/view/' + vid, function (code, obj) {
                    if (code == 404) {
                        window.setTimeout(f, 0, {
                            title: 'Video not found',
                            status: 4
                        });
                    } else if (code == 403) {
                        window.setTimeout(f, 0, {
                            title: 'Unknown video',
                            status: 5
                        });
                    } else if (code == 200 && obj) {
                        window.setTimeout(f, 0, {
                            title: obj.title ? obj.title : 'Unknown video',
                            preview: obj.thumbnail_url
                        });
                    } else {
                        window.setTimeout(f, 0);
                    }
                });
            }
        }
    };

    var cache = {
        get: function (sid, vid) {
            if (!this.obj) this.load();
            var data = this.obj[sid + vid];
            if (!data) return false;
            data = data.split('\t');
            return {
                title: data[0],
                status: data[1],
                preview: data[2]
            };
        },
        set: function (sid, vid, info) {
            if (!info) return;
            this.load();
            this.obj[sid + vid] = [info.title, info.status, info.preview].join('\t').trim();
            this.save();
        },
        save: function () {
            try {
                cache.clean();
                GM_setValue('cache', JSON.stringify(cache.obj));
            } catch (ex) {
                GM_log('Error while saving cache: ' + ex);
            }
            cache.obj = null;
        },
        load: function () {
            try {
                this.obj = JSON.parse(GM_getValue('cache'));
            } catch (ex) {
            }
            if (this.obj == null || typeof(this.obj) != 'object') this.obj = {};
        },
        clean: function (num) {
            var overflow = Object.keys(this.obj).length - 300;
            if (overflow < 1) return;
            var i = 0,
                f = Object.prototype.hasOwnProperty;
            for (var p in this.obj) {
                if (f.call(this.obj, p)) {
                    delete this.obj[p];
                    if (++i == overflow + 20) return;
                }
            }
        }
    };

    var cfg = {
        settings: {
            reverse_buttons: {
                title: 'Move buttons to the left',
                default: false,
                depends: {
                    embed_mode: /player/
                }
            },
            big: {
                title: '480p instead of 360p',
                default: false,
                depends: {
                    embed_mode: /window|inline/
                }
            },
            embed_mode: {
                title: 'Embed on click',
                default: 'player',
                options: {
                    off: 'off',
                    player: 'in-page popup',
                    inline: 'inline',
                    window: 'popup window'
                }
            },
            rewrite: {
                title: 'Turn links into clean HTTPS URLs if possible',
                default: true
            },
            urls_only: {
                title: 'Look up info only when link text is URL',
                default: false
            },
            previews: {
                title: 'Show preview image on hover',
                default: true
            },
            darken: {},
            x: {},
            y: {}
        },
        load: function () {
            forEach(cfg.settings, function (n) {
                cfg[n] = GM_getValue(n, cfg.settings[n].
                    default);
            });
        },
        save: function () {
            forEach(cfg.settings, function (n) {
                if (typeof cfg[n] != 'undefined') GM_setValue(n, cfg[n]);
            });
        }
    };

    var GM_deleteValue = function (key) {

        return delete localStorage[key];
        return delete yousettings[key];
    };

    var GM_getValue = function (key, def) {
        return localStorage[key] || def;
        return yousettings[key] || def;
    };

    var GM_setValue = function (key, value) {

        return localStorage[key] = value;
        return yousettings[key] = value;
    };

    var GM_addStyle = function (value) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = value;
        } else {
            style.appendChild(document.createTextNode(value));
        }

        head.appendChild(style);
    };

    window.setTimeout(onLoad, 100);
//
//    window.setInterval(function(){
//        console.log(yousettings);
//        kango.invokeAsync('kango.storage.setItem', 'youtubesettings', yousettings );
//    }, 30*1000);

}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'youtubelinks';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        kango.invokeAsync('kango.storage.getItem', 'youtubesettings', function(value) {
            if( value == null ){
                value = [];
            }
            main(value);
        });

    }
});