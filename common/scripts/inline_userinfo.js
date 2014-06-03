// ==UserScript==
// @name          Inline UserInfo (Normal Style)
// @namespace     leprosorium++userinfo
// @description   Show additional user info for leprosorium.ru.
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// @author        mcm69, tender, inga, rpsl
// @require     zepto.js
// ==/UserScript==

// all patch by //tender

function main()
{
    String.prototype.format = function() {
        var formatted = this;
        for( var arg in arguments ) {
            formatted = formatted.replace("{" + arg + "}", arguments[arg]);
        }
        return formatted;
    };

    function plural_str(i, str1, str2, str3){
        function plural (a){
            if ( a % 10 == 1 && a % 100 != 11 ) return 0;
            else if ( a % 10 >= 2 && a % 10 <= 4 && ( a % 100 < 10 || a % 100 >= 20)) return 1;
            else return 2;
        }

        switch (plural(i)) {
            case 0: return str1;
            case 1: return str2;
            default: return str3;
        }
    }


    var div_obj = null;
    var c_link = null;
    var hid = 0;
    var tid = 0;
    var div_html = "";
    var inRun = 0;

    // create a hidden div
    div_obj = document.createElement("div");
    div_obj.id = "hoverinfo";
    div_obj.style.display="none";
    div_obj.style.position="absolute";
    div_obj.style.border="1px solid #aaa";
    div_obj.style.minWidth="200px";
    div_obj.style.minHeight="30px";
    div_obj.style.zIndex="99";
    div_obj.style.color="#999";
    div_obj.style.fontSize="11px";
    div_obj.style.padding="10px 10px 10px 10px";
    div_obj.style.whiteSpace="nowrap";
    div_obj.style.background = "url('data:image/gif;base64,R0lGODlhEAAQAPQAAP///8zMzPz8/NfX1+Xl5c3NzdPT0/b29u3t7dDQ0OPj4+Dg4Pj4+Onp6fLy8tra2tzc3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==')";
    div_obj.addEventListener("mouseover", hoverDiv, false);
    div_obj.addEventListener("mouseout", hideDiv, false);
    document.body.appendChild(div_obj);

    var dt = document.createElement('div');
    document.body.insertBefore(dt, document.body.firstChild);


    $('.c_user').each(function(k,v){
        v.addEventListener('mouseover', mouseOver, false);
        v.addEventListener('mouseout', mouseOut, false);
    });

    document.addEventListener("DOMNodeInserted", handleUserInfo, false);

    function handleUserInfo(event) {

        var check = $(event.target).find('.c_user');

        if( check.length > 0 )
        {
            $(check).each(function(k,v){
                v.addEventListener('mouseover', mouseOver, false);
                v.addEventListener('mouseout', mouseOut, false);
            });
        }
    }


    function mouseOver(e)
    {
        e = e || window.event;

        if (e.pageX == null && e.clientX != null )
        {
            var html = document.documentElement;
            var body = document.body;

            e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
            e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
        }

        div_obj.innerHTML = '';

        div_obj.style.left = e.pageX  + 'px';
        div_obj.style.top = e.pageY + 'px';

        clearInterval(hid);
        tid = setInterval(hoverInfo, 1500);
        c_link = this;
    }

    function mouseOut(e)
    {
        clearInterval(tid);
        hid = setInterval(hideDiv, 500);
    }

    function hoverDiv()
    {
        clearInterval(hid);
    }

    function hideDiv(e)
    {
        if (e == null) return;

        var t = e.relatedTarget;
        if(t && (	t.id == "inline_userlink" ||
            t.id == "hoverinfo" ||
            t.id == "user_pic" ||
            t.id == "user_pic_link" ||
            t.id == "user_post"||
            t.id == "user_comm" ||
            t.id == "tbl" ||
            t.id == "tbl_tr" ||
            t.id == "td_text_head" ||
            t.id == "inga"
            ))
        {
            return;
        }



        div_obj.style.display="none";
        clearInterval(hid);
    }

    function hoverInfo()
    {
        clearInterval(tid);

        div_html="";
        var id = c_link.getAttribute("data-user_id");
        div_obj.innerHTML = "...";
        div_obj.style.display= "block";
        div_obj.style.background = "#fff url('data:image/gif;base64,R0lGODlhEAAQAPQAAP///8zMzPz8/NfX1+Xl5c3NzdPT0/b29u3t7dDQ0OPj4+Dg4Pj4+Onp6fLy8tra2tzc3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==') center center no-repeat";

        get_UserInfo(id);
    }

    function get_UserInfo( id ) {
        var details = {
            method: 'GET',
            url: 'https://leprosorium.ru/api/lepropanel/' + id,
            async: true,
            contentType: 'json'
        };

        kango.xhr.send(details, function(data) {
            if (data.status == 200 && data.response != null) {
                setUserInfo( data.response );
            }
            else { // something went wrong
                console.log('something went wrong');
            }
        });

    }

    function setUserInfo( data ) {

        var tpl =   '<table><tr>' +
                    '<td style="padding-right: 15px;"><b>{0}</b> #{1}</td><td>Зарегистрирован {2}</td></tr>' +
                    '<tr><td>Карма: {3}</td><td>{4} / {5}</td></tr>' +
                    '<tr><td style="padding-right: 15px;">Рейтинг: {6}</td><td>{7} / {8}</td></tr></table>';

        var his_karm = data.hiskarmavote;

        if( his_karm == 0 ) {
            his_karm = 'Он не голосовал';
        } else {

            if( parseInt(his_karm)<0){
                his_karm = '<span style="color:red; font-weight: bold;">'+his_karm+'</span>';
            } else {
                his_karm = '<span style="color: green; font-weight: bold;">'+his_karm+'</span>';
            }

            his_karm = 'Он поставил: '+ his_karm;
        }

        var you_karm = data.karmavote;

        if( you_karm == 0 ) {
            you_karm = 'Вы не голосовали';
        } else {
            if( parseInt(you_karm)<0){
                you_karm = '<span style="color: red; font-weight: bold;">'+you_karm+'</span>';
            } else {
                you_karm = '<span style="color: green; font-weight: bold;">'+you_karm+'</span>';
            }

            you_karm = 'Вы поставили: '+ you_karm;
        }

        var posts = plural_str(parseInt(data.posts), 'пост', 'поста', 'постов');
        var comments = plural_str(parseInt(data.comments), 'комметарий', 'комментария', 'комментариев');

        posts = data.posts + ' ' + posts;
        comments = data.comments + ' ' + comments;

        div_obj.innerHTML = tpl.format(data.login, data.uid, data.regdate, data.karma, you_karm, his_karm, data.rating, posts, comments );
        div_obj.style.background = 'white';

    }


}





kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'inlineuserinfo';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});