// ==UserScript==
// @name          LeproNamesAndPages
// @namespace	leprosorium++leprotitles
// @author     ACTPOHABT (8110), Omen (12643), Vizzy (27480)
// @description   Заменяет скучное "Лепрозорий / Убежище" на номер страницы или юзернэйм.
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*
// ==/UserScript==

function main() {

    var currentTitle = '',
        newtitle = '',
        page, url = document.URL,
        wannabetitle, karma, username, usernumber, length_title = 50,
        pots, i, j = 0;

    var indexNum = 0;
    var indices =[]; // Переменные

    function sortindices(a, b) //этим методом мы потом отсортируем индексы
    {
        return a - b;
    }

    if (document.title.length < 10) {
        currentTitle = ' / ' + document.title;
    }

    // ^https?:\/\/(\w+\.)?leprosorium\.(ru|com)
    // ^https?:\/\/(\w+\.)?leprosorium\.(ru|com)

    if (/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/users\/\w+(\/)?/.test(document.URL)) //страничка с чьим-то профайлом
    {
        username = document.URL.match(/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/users\/(\w+)(\/)?/)[3]; // Грузим имярек

        if (/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/users\/\w+(\/)?$/.test(document.URL)) {
            //    karma = document.getElementsByClassName('rating')[0].childNodes[0].innerHTML;
            // usernumber = document.getElementsByClassName('vote')[0].getAttribute('uid');
            usernumber = document.getElementsByClassName('b-user_name-link')[0].parentNode.parentNode.textContent.match('#([0-9.]+)')[0].replace('.','');
            //    newtitle = wannabetitle + ' (' + usernumber + '), его карма: ' + karma;
            wannabetitle = username + ' (' + usernumber + ')';
            newtitle = wannabetitle;

        } else {
            wannabetitle = 'Про ' + username;
            newtitle = wannabetitle;
        }
    }

    if ((/^https?:\/\/leprosorium\.(ru|com)\/pages\/1(\/)?$/.test(document.URL)) || (/^https?:\/\/leprosorium\.(ru|com)(\/)?$/.test(document.URL))) //страничка с главной
    {
        newtitle = 'Глагне';
    }

	if((/^https?:\/\/(\w+)?\.leprosorium\.(ru|com)(\/)?$/.test(document.URL))) // Подлепра
	{
		newtitle = /^https?:\/\/(\w+)?\.leprosorium\.(ru|com)(\/)?$/.exec(document.URL)[1];
	}

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/democracy(\/)?$/.test(document.URL))) //Белый дом
    {
        newtitle = 'Белый дом';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/elections\/president(\/)?$/.test(document.URL))) //Выборы
    {
        newtitle = 'Выборы';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/fraud\/(\w+)?(\/)?$/.test(document.URL))) //Магазин и все, что в нем есть
    {
        newtitle = 'Фрод';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/underground(\/)?$/.test(document.URL))) //Страница со списком подлепр
    {
        newtitle = 'Блоги';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/users(\/)?$/.test(document.URL))) //Страница с информацией о юзерах
    {
        newtitle = 'Люди';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/users\/\?username=(\w+)?\&firstname=(\w+)?\&lastname=(\w+)?\&icq=(\d+)?\&(x=\d+\&y=\d+)?$/.test(document.URL))) //Страница поиска людей
    {

        var userstring = document.URL.match(/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/users\/\?username=(\w+)?\&firstname=(\w+)?\&lastname=(\w+)?\&icq=(\d+)?\&(x=\d+\&y=\d+)?$/);

        wannabetitle = "Ищем ";

        try {
            username = userstring[3];
            if (username.length > 0) {
                wannabetitle += username + " ";
            }
        } catch (err) {
        }

        try {
            firstname = userstring[4];
            if (firstname.length > 0) {
                wannabetitle += firstname + " ";
            }
        } catch (err) {
        }

        try {
            lastname = userstring[5];
            if (lastname.length > 0) {
                wannabetitle += lastname + " ";
            }
        } catch (err) {
        }

        try {
            icq = userstring[6];
            if (icq.length > 0) {
                wannabetitle += icq;
            }
        } catch (err) {
        }

        newtitle = wannabetitle;
    }

    if (/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/pages\/\d+(\/)?$/.test(document.URL)) // страничка Лепры, но не главная
    {
        page = document.URL.match(/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/pages\/(\d+)$/)[3];
        newtitle = page + '-я страница';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my(\/)?$/.test(document.URL))) //страничка с моими вещами
    {
        newtitle = document.getElementById('js-header_nav_my_things').textContent;
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my\/socialism(\/)?$/.test(document.URL))) //страничка с социализмом
    {
        newtitle = 'Социализм';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my\/favourites(\/)?$/.test(document.URL))) //страничка с favourites
    {
        newtitle = 'Избранное';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my\/details(\/)?$/.test(document.URL))) //страничка с details
    {
        newtitle = 'Детали';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my\/settings(\/)?$/.test(document.URL))) {
        newtitle = 'Настройки';
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my\/inbox(\/)?$/.test(document.URL))) //страничка с Инбоксом
    {
        newtitle = 'инбокс ' + document.getElementById('js-header_nav_inbox').textContent;
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/asylum(\/)?$/.test(document.URL))) //Страничка для нового поста
    {
        newtitle = 'Новый пост';
    }

    if (/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/mod\/\d+(\/)?$/.test(document.URL)) {
        newtitle = 'Правим ' + document.title.toLowerCase();
    }

    if ((/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/comments\/\d+/.test(document.URL)) || (/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my\/inbox\/\d+/.test(document.URL))) //страничка с постом
    {
        pots = document.getElementsByClassName('dt'); // Грузим пост
        if (pots[j].textContent.trim().length == 0) // Проверка на пустой пост (одна картинка например)
        {
            var coms = document.getElementsByClassName('c_body');

            while (coms[j].textContent.trim().length == 0) {
                j++; // Как бы говорим взять первый коментарий, потому что в посте ничерта нет
            }
            newtitle = coms[j].textContent.trim().toLowerCase();
        } else //отлично, пост не пустой
        {
            if (pots[j].innerHTML.indexOf('<b>') != -1 && pots[j].innerHTML.indexOf('<b>') < 5) //попробуем взять заголовки, заданные тегом <b>
            {
                newtitle = pots[j].childNodes[0].innerHTML.toLowerCase();
            } else if (pots[j].innerHTML.indexOf('<br>') != -1 && pots[j].innerHTML.indexOf('<br>') < length_title) {
                newtitle = pots[j].innerHTML.split('<br>')[0].toLowerCase().replace(/<\/?[^>]+>/gi, '');
            } else {
                newtitle = pots[j].textContent.toLowerCase(); //если их нет, то просто возьмем, что есть
            }
        }
    }


    if (newtitle != '') {

        //Сейчас мы будем добавлять индексы разных знаков препинания
        if (newtitle.indexOf(".") != -1 && newtitle.indexOf(".") < 70) {
            indices[indexNum] = newtitle.indexOf(".");
            indexNum++;
        }

        if (newtitle.indexOf("!") != -1 && newtitle.indexOf("!") < 70) {
            indices[indexNum] = newtitle.indexOf("!") + 1;
            indexNum++;
        }

        if (newtitle.indexOf("?") != -1 && newtitle.indexOf("?") < 70) {
            indices[indexNum] = newtitle.indexOf("?") + 1;
            indexNum++;
        }

        if (newtitle.indexOf("…") != -1 && newtitle.indexOf("…") < 70) {
            indices[indexNum] = newtitle.indexOf("…") + 1;
            indexNum++;
        }

        indices.sort(sortindices); //тут мы эти индексы отсортируем

        if (indexNum > 0) //тут мы обрежем по эти самые индексы
        {
            newtitle = newtitle.substring(0, indices[0]);
        } else if (indexNum == 0 && newtitle.length > length_title) //или просто обрежем
        {
            newtitle = newtitle.substring(0, length_title) + '...';
        }

        document.title = newtitle + currentTitle; //Вот и все!
    }
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'leprotitles';

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        main();
    }
});
