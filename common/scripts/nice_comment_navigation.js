// ==UserScript==
// @name		Leprosorium nice comments navigation
// @namespace	leprosorium++nicecomments
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @require     zepto.js
// ==/UserScript==

function main() {

    var originalColor = null;

    function drawBorder(element) {

        $("#" + element.id).find('.c_i').addClass("comm_border");
    }

    function removeBorder(element) {
        $("#" + element.id).find('.c_i').removeClass("comm_border");
    }

    function flashColor(element) {
        var dt = $("#" + element.id).find(".c_i");

        if( originalColor == null ) {
            originalColor = dt.css("background-color");
        }

        dt.css('background-color', options.highliteColor);
        setTimeout(function () {
            dt.css('background-color', originalColor );
        }, 350);
    }

    function getNextCommentPos() {
        var pos = 0;
        do {
            index++;
            index %= newComms.length;
            pos = $(newComms[index]).offset().top;
            if (index === 0) {
                break;
            }
        } while (window.pageYOffset > pos){}
        return pos - 10;
    }

    function getPrevCommentPos() {
        var pos = 0;
        do {
            index--;
            index %= newComms.length;
            if (index < 0) {
                index += newComms.length;
            }
            pos = $(newComms[index]).offset().top;
            if (index === 0) {
                break;
            }
        } while (window.pageYOffset > $("#js-comments").offset().top && window.pageYOffset < pos - 10);
        return pos - 10;
    }

    function ScrollToComment(getPos, e) {
        var pos = 0;

        if (options.drawBorder) {
            removeBorder(newComms[index]);
        }
        pos = getPos();

        var pos1 = pos;

        if (!$(newComms[index]).hasClass("indent_0") && (options.showPrevComment || e.ctrlKey)) {
            var prev = $(newComms[index]).prev();

            if (prev.length) {
                pos = prev.offset().top - 10;
            }
        }

        if( pos1-pos > windowHeight/2)
        {
            pos=pos1-100;
        }

        if (options.drawBorder) {
            drawBorder(newComms[index]);
        }
        if (options.smoothScroll) {
            scroll(pos, 250);

        } else {
            window.scroll(0, pos);
        }

        if (options.highliteComment) {
            flashColor(newComms[index]);
        }
        $("#current_comment").html(index + 1);
    }

    function ScrollToNextNewComment(e) {
        ScrollToComment(getNextCommentPos, e);
    }

    function ScrollToPrevNewComment(e) {
        ScrollToComment(getPrevCommentPos, e);
    }

    function keyDownHandler(e) {
        var targ = e.target;
        var editTags = {
            'TEXTAREA': '',
            'INPUT': '',
            'TEXT': '',
            'PASSWORD': ''
        };

        if (targ && !(targ.tagName in editTags)) {
            if (e.keyIdentifier == "U+004A" || e.which == e.DOM_VK_J) {
                ScrollToNextNewComment(e);
            } else if (e.keyIdentifier == "U+004B" || e.which == e.DOM_VK_K) {
                ScrollToPrevNewComment(e);
            }
        }
    }

    function scroll(scrollTo, time) {

        var top = f_scrollTop();

        var scrollFrom = parseInt(top),
            i = 0,
            runEvery = 13; // run every 5ms

        scrollTo = parseInt(scrollTo);
        time = runEvery;

        var interval = setInterval(function () {
            i++;

            // todo
            top = (scrollTo - scrollFrom) / time * i + scrollFrom;

            $('html,body').scrollTop(top);

            if (i >= time) {
                clearInterval(interval);
            }
        }, runEvery);
    }

    function f_scrollTop() {
        return f_filterResults (
            window.pageYOffset ? window.pageYOffset : 0,
            document.documentElement ? document.documentElement.scrollTop : 0,
            document.body ? document.body.scrollTop : 0
        );
    }
    function f_filterResults(n_win, n_docel, n_body) {
        var n_result = n_win ? n_win : 0;
        if (n_docel && (!n_result || (n_result > n_docel)))
            n_result = n_docel;
        return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
    }


    if( location.pathname.search('comments') !== -1 || location.pathname.search('inbox') !== -1 ) {

        var newComms = $(".new").get();
        var index = 0;
        var windowHeight = document.body.offsetHeight;

        window.onresize = function(event) {
            windowHeight = document.body.offsetHeight;
        };


        if (newComms.length > 0) {

            var options = {
                navigateWith: "arrows",
                drawBorder: false,
                highliteComment: false,
                highliteColor: "#f4fbac",
                showPrevComment: true,
                smoothScroll: false
            };


            kango.invokeAsync('kango.storage.getItem', 'nice_comments', function(value) {

                if( value == null ) {
                    value = [];
                }

                $.each(value, function(k,v){
                   if( v.value == "on" ) {
                        options[ v.name ] = true;
                   }
                });

                options.smoothScroll = false;
                options.drawBorder = true;

                var style = document.createElement("style");
                style.type = "text/css";
                style.innerHTML = ".lc-next-block {  position: fixed;  top: 320px;  right: 0px;  z-index: 100;  }  .lc-next-block span {  display: block;  width: 28px;  height: 28px;  color: #000;  background-color: #fff;  border: 1px solid #000;  padding: 0pt;  margin: 0pt;  margin-bottom: 1px;  cursor: pointer;  opacity: 0.25;  height: 100%;  padding: 6px 0; text-align: center; }  .lc-next-block span:hover {  opacity: 1;  }  .comm_border {  border: 1px solid black !important;  }  ";

                document.body.appendChild(style);

                $("<div />", {class: "lc-next-block"})
                    .append($("<span />", { text: "↑", id: "scroll_prev" }))
                    .append($("<span />", { text: "↓", id: "scroll_next" }))
                    .appendTo("body");

                document.addEventListener('keydown', keyDownHandler, false);

                $('#scroll_prev').on('click', function(e){

                    ScrollToPrevNewComment(e);

                    e.preventDefault();
                });

                $('#scroll_next').on('click', function(e){

                    ScrollToNextNewComment(e);

                    e.preventDefault();
                });
            });


        }
    }
}


kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'nicecomments';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
