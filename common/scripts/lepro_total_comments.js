// ==UserScript==
// @name       Lepro Total Comments v3
// @namespace   leprosorium++totalcomments
// @description  lepro total comments v3 for fictional and not real leprosorium worls
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @license      MIT
// @copyright  2014+, itspoma, barbie
// ==/UserScript==


function main() {

    var pluginId = 'lepro-total-comments-v2',
        defaultMode = 'all',
        hashPrefix = 'ltc-',
        hashRegex = new RegExp(hashPrefix),
        standard_deviation = 0,
        style, panelEl, comments, commentsLength, mode, authors = {},
        parent = [];

    var modes = {

        'all': {
            title: 'все',
            isMatch: function () { return true; }
        },

        'new': {
            title: 'новые',
            isMatch: function (comment) {

                // craphack. По хорошему нужно в comments собирать массив по id комментария { comment_id: element }
                var value = comment.el.classList.contains('new');

                if( value && comment.el.getAttribute('data-parent_comment_id') !== null )
                {
                    parent.push( comment.el.getAttribute('data-parent_comment_id') );
                }
                return value;
            }
        },

        'image': {
            title: 'картинки',
            isMatch: function (comment) { return /<img\s/.test(comment.body); }
        },

        'link': {
            title: 'ссылки',
            isMatch: function (comment) { return /<a\s/.test(comment.body); }
        },

        'nice': {
            title: 'клеви',
            init: function () {

                var abovenull = 0,
                    rating_square_sum = 0,
                    rating_sum = 0, comment;

                for (var i = 0; i < commentsLength; i++) {

                    comment = parseComment(comments[i]);

                    if (comment.rating > 0) {
                        abovenull++;
                        rating_sum += comment.rating;
                        rating_square_sum += Math.pow(comment.rating, 2);
                    }
                }

                standard_deviation = Math.sqrt(( rating_square_sum - (Math.pow(rating_sum, 2) / abovenull) ) / (abovenull - 1));
            },
            isMatch: function (comment) {
                if (comment.rating <= 0) return false;
                return (comment.rating / standard_deviation) >= 0.8;
            }
        },

        'mine': {
            title: 'мои',
            isMatch: function (comment) { return comment.el.classList.contains('mine'); }
        },

        'male': {
            title: 'М',
            isMatch: function (comment) {
                return /Написал\s/.test(comment.el.querySelector('.ddi').innerText)
            }
        },

        'female': {
            title: 'Ж',
            isMatch: function (comment) {
                return /Написала\s/.test(comment.el.querySelector('.ddi').innerText)
            }
        },

        'author': {
            title: 'по автору:',
            render: function (containerEl) {
                var author, dataList, authorEl,
                    filterByAuthor = function () {
                        var author = document.getElementById('ltc-author-name').value;
                        if (author.length < 0) return;

                        setViewMode('author');
                    };

                authorEl = elemWithId('input', 'ltc-author-name');

                authorEl.setAttribute('placeholder', 'ник автора');
                authorEl.setAttribute('list', 'authors');

                authorEl.addEventListener("change", function () {
                    filterByAuthor();
                    return false;
                });
                authorEl.addEventListener("keypress", function (event) {
                    if (event.keyCode != 13) return false;
                    filterByAuthor();
                });

                dataList = elemWithId('datalist', 'authors');

                for (author in authors) {
                    var option = document.createElement('option');
                    option.value = author;
                    dataList.appendChild(option);
                }

                containerEl.appendChild(dataList);
                containerEl.appendChild(authorEl);

                return containerEl;
            },
            showCount: false,
            tooltip: 'показать комментарии только этого юзернейма',
            isMatch: function (comment) {
                var authorValue = document.getElementById('ltc-author-name').value;
                if (!authorValue) return true;

                return comment.author === authorValue;
            }
        }
    };

    // helpful functions
    var elemWithId = function (tag, id) {
            var el = document.createElement(tag);
            el.id = id;
            return el;
        },

        insertAfter = function (where, what) {
            where.parentNode.insertBefore(what, where.nextSibling);
        },

        removeElement = function (el) {
            el.parentNode.removeChild(el);
        },

        iterateOverModes = function(func) {
            for (var name in modes) {
                if (modes.hasOwnProperty(name)) func(modes[name], name);
            }
        },

        parseComment = function (commentEl) {
            return {
                el: commentEl,
                body: commentEl.getElementsByClassName('c_body')[0].innerHTML,
                rating: parseInt(commentEl.getElementsByClassName('vote_result')[0].innerHTML),
                author: commentEl.getElementsByClassName('c_user')[0].innerHTML
            };
        };

    // Рисуем панельку с кнопками вызова режима фильтрации
    var createPanel = function () {

        var mode, introEl, counter = {};

        panelEl = document.getElementById(pluginId);

        if (panelEl) removeElement(panelEl);

        document.getElementsByClassName('b-comments_controls')[0].style.display = 'none';

        panelEl = elemWithId('div', pluginId);
        panelEl.className = 'ltc-panel';

        introEl = document.createElement('span');
        introEl.style.marginRight = '10px';
        introEl.textContent = 'Показать комментарии:';
        panelEl.appendChild(introEl);

        iterateOverModes(function (mode) {
            if (typeof mode.init !== 'undefined') mode.init();
        });

        // парсинг комментов, подсчет количества комментов по фильтрам
        for (var i = 0; i < commentsLength; i++) {

            var comment = parseComment(comments[i]);

            comment.el.setAttribute('data-author', comment.author);
            authors[comment.author] = authors.hasOwnProperty(comment.author) ? authors[comment.author] + 1 : 1;

            iterateOverModes(function(mode, modeName) {
                if (mode.showCount === false) return;
                if (!counter.hasOwnProperty(modeName)) counter[modeName] = 0;
                if (mode.isMatch(comment)) counter[modeName]++; // todo mutable variable is accessible from closure
            })
        }

        iterateOverModes(function(mode, modeName) {

            var containerEl = elemWithId('span', 'ltc-container-' + modeName);
            containerEl.className = 'ltc-container';

            var linkEl = elemWithId('span', 'ltc-mode-' + modeName);

            if (modeName !== 'all') {
                linkEl.style.marginLeft = '15px';
            }

            linkEl.className = 'ltc-mode';

            linkEl.appendChild(document.createTextNode(mode.title));
            linkEl.addEventListener("click", function (ev) {
                setViewMode(ev.target.id.replace('ltc-mode-', ''));
                return false;
            }, false);

            if (typeof mode.tooltip !== 'undefined') linkEl.setAttribute('title', mode.tooltip);

            containerEl.appendChild(linkEl);

            if (mode.showCount !== false) {
                var count = counter[modeName] || '0';

                var countEl = document.createElement('span');
                countEl.className = 'ltc-count';
                countEl.appendChild(document.createTextNode(count));
                countEl.addEventListener("click", function (ev) {
                    ev.target.hash.replace('#ltc-', '');
                    return false;
                }, false);

                containerEl.appendChild(countEl);
            }

            if (typeof mode.render !== 'undefined') containerEl = mode.render(containerEl);

            panelEl.appendChild(containerEl);
        });

        insertAfter(document.getElementsByClassName('b-comments_controls')[0], panelEl);
    };

    var resetPanel = function () {
        var selectedMode = getViewMode();

        var containerEl = document.getElementById('ltc-container-' + selectedMode);

        if (containerEl) {
            containerEl.classList.remove('selected');

            var linkEl = containerEl.getElementsByClassName('ltc-mode')[0];
            linkEl.classList.remove('selected');
            linkEl.style.color = '#888';
            linkEl.style.borderBottom = '1px dotted';

            var countEl = containerEl.getElementsByClassName('ltc-count')[0];
            if (countEl) {
                countEl.classList.remove('selected');
                countEl.style.background = '#EEE';
            }
        }
    };

    var getViewMode = function () {

        var containerEls = panelEl.getElementsByClassName('ltc-container');

        for (var i = 0, len = containerEls.length; i < len; i++) {
            var containerEl = containerEls[i];

            if (containerEl.classList.contains('selected') === true) {
                return containerEl.id.replace('ltc-container-', '');
            }
        }

        return defaultMode;
    };

    var setViewMode = function (modeName) {

        var mode, selectedMode, containerEl;

        mode = modes[modeName];
        if (!mode) return;

        selectedMode = getViewMode();
        if (mode === selectedMode) return;

        containerEl = document.getElementById('ltc-container-' + modeName);
        if (!containerEl) return;

        resetPanel();

        if (modeName == 'author') {
            var authorValue = document.getElementById('ltc-author-name').value;
//            location.hash = '#ltc-author-' + authorValue;
            storeMode('#ltc-author-' + authorValue);
        } else {
//            if (modeName !== defaultMode) location.hash = '#ltc-' + modeName;
//            else if (modeName === defaultMode) location.hash = '';

            if (modeName !== defaultMode) {
                storeMode('#ltc-' + modeName)
            }else if (modeName === defaultMode){
                storeMode('')
            }
        }

        containerEl.classList.add('selected');

        var linkEl = containerEl.getElementsByClassName('ltc-mode')[0];
        linkEl.classList.add('selected');

        var countEl = containerEl.getElementsByClassName('ltc-count')[0];
        if (countEl) countEl.classList.add('selected');

        parent = [];

        for (var i = 0; i < commentsLength; i++)
        {
            if (!mode.isMatch(parseComment(comments[i]))) {
                comments[i].style.display = 'none';
            }
            else
            {
                comments[i].style.display = 'block';
            }
        }

        if( parent.length > 0 )
        {
            for( var p in parent )
            {
                showParent(parent[p]);
            }

            parent = [];
        }
    };

    var showParent = function( id ) {
        var obj = document.getElementById( id);
        obj.style.display = 'block';

        var parent = obj.getAttribute('data-parent_comment_id');

        if( parent !== null ) {
            showparent( parent );
        }
    };

    var storeMode = function( mode ) {
        kango.invokeAsync('kango.storage.setItem', 'total::mode', mode );
    };

    /* Start script execution */

    if( !/comments/.test(location.pathname) ) return;

    comments = document.getElementsByClassName('comment');
    commentsLength = comments.length;

    createPanel();

    kango.invokeAsync('kango.storage.getItem', 'total::mode', function(value){
        if ( hashRegex.test(value) ) {

            mode = value.replace('#' + hashPrefix, '');

            if (mode.search('author-') === 0) {
                document.getElementById('ltc-author-name').value = mode.replace('author-', '');
                setViewMode('author');
            }
            else {
                setViewMode(mode);
            }
        } else {
            setViewMode(defaultMode);
        }

    });

    document.body.addEventListener('click', function(ev) {

        var className = ev.target.className;

        if (className === 'c_show_user') {
            document.getElementById('ltc-author-name').value = ev.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-author');
            setViewMode('author');
        }

        if (className === 'c_parent') {
            var parentId = ev.target.getAttribute('replyTo'),
                parentComment = document.getElementById(parentId);
            parentComment.style.display = 'block';
        }
    });

    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = ".ltc-panel { width: 95%; background: #F5F5F5; padding: 5px 10px; margin: -30px 0 25px 0 } \
                        .ltc-container > span { cursor: pointer; color: #888; border-bottom: 1px dotted; text-decoration: none } \
                        .ltc-count { margin-left: 3px; background: #EEE; padding: 4px; border-radius: 5px; font: 10px Verdana } \
                        #ltc-author-name { width: 100px; margin-left: 5px; padding: 3px; } \
                        .ltc-mode.selected { color: #000; border-bottom: none} \
                        .ltc-count.selected { background: #DFDFDF }";

    document.body.appendChild(style);

}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'totalcomments';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});