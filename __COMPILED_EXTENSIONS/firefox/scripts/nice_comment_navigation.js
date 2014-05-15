// ==UserScript==
// @name		Leprosorium nice comments navigation
// @namespace	leprosorium++nicecomments
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// ==/UserScript==

function main() {


    function drawBorder(element) {

        console.log( element );

        $("#" + element.id + " .b-comment_outline").addClass("comm_border");
    }

    function removeBorder(element) {
        $("#" + element.id + " .b-comment_outline").removeClass("comm_border");
    }

    function flashColor(element) {
        var dt = $("#" + element.id + " .b-comment_outline");
        var originalColor = dt.css("backgroundColor");


        dt.css({backgroundColor: options.highliteColor});
        setTimeout(function () {
            dt.css({backgroundColor: originalColor});
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
        } while (window.pageYOffset > pos)
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
        } while (window.pageYOffset > $("#js-commentsHolder").offset().top && window.pageYOffset < pos - 10);
        return pos - 10;
    }

    function ScrollToComment(getPos, e) {
        var pos = 0;

        if (options.drawBorder) {
            removeBorder(newComms[index]);
        }
        pos = getPos();
        if (!$(newComms[index]).hasClass("indent_0") && (options.showPrevComment || e.ctrlKey)) {
            var prev = $(newComms[index]).prev();

            if (prev.length) {
                pos = prev.offset().top - 10;
            }
        }
        if (options.drawBorder) {
            drawBorder(newComms[index]);
        }
        if (options.smoothScroll) {
            $('html,body').animate({scrollTop: pos}, 250);
        } else {
            window.scroll(0, pos);
        }
        if (options.highliteComment) {
            flashColor(newComms[index]);
        }
        $("#current_comment").text(index + 1);
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


    var newComms = $("#js-commentsHolder .new").get();
    var index = 0;

    if (newComms.length > 0) {

        var options = { navigateWith: "arrows",
            drawBorder: true,
            highliteComment: true,
            highliteColor: "#f4fbac",
            showPrevComment: true,
            smoothScroll: true
        };

        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = "\
	.lc-next-block { \
        position: fixed; \
        top: 400px; \
        right: 0px; \
        z-index: 100; \
      } \
      .lc-next-block span { \
        display: block; \
        width: 28px; \
        height: 28px; \
        color: #000; \
        background-color: #fff; \
        border: 1px solid #000; \
        padding: 0pt; \
        margin: 0pt; \
        margin-bottom: 1px; \
        cursor: pointer; \
        opacity: 0.25; \
        height: 100%; \
        padding: 6px 0;\
        text-align: center;\
      } \
      .lc-next-block span:hover { \
        opacity: 1; \
      } \
      .comm_border { \
        border: 1px solid black !important; \
        } \
	  ";

        document.body.appendChild(style);

        if (options.navigateWith === "arrows") {
            $("<div />", {class: "lc-next-block"})
                .append($("<span />", { text: "↑", click: ScrollToPrevNewComment }))
                .append($("<span />", { text: "↓", click: ScrollToNextNewComment }))
                .appendTo("body");
        } else {
            $("<div />", { id: "lc-next-block" })
                .append($("<button />", { id: "current_comment", text: "1", click: ScrollToPrevNewComment}))
                .append($("<span />", { text: " / "}))
                .append($("<button />", { text: newComms.length, click: ScrollToNextNewComment}))
                .appendTo("body");
        }

        document.addEventListener('keydown', keyDownHandler, false);
    }
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'nicecomments';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
