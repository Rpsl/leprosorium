Leprosorium
===========

Leprosorium++ extension for Google Chrome, Mozilla Firefox and Safari

![show m later](https://raw.github.com/Rpsl/leprosorium/master/lepro++.png)


Установка
===========
* [Google Chrome](https://chrome.google.com/webstore/detail/leprosorium%20%20/cmoaeoopgbabkeljpdoocejcjnednikb?utm_source=chrome-ntp-icon) ставьте расшриение из магазина.
* [Mozilla Firefox](https://github.com/Rpsl/leprosorium/raw/master/__COMPILED_EXTENSIONS/leprosorium_0.7.xpi) после скачивания файла перетяните его на страницу "дополнения" в FF.
* [Safari](https://github.com/Rpsl/leprosorium/raw/master/__COMPILED_EXTENSIONS/leprosorium_0.7.safariextz) после скачивания кликайте два раза на файл.

Для разработчиков
===========

Приложение основано на фреймворке [Kango](http://kangoextensions.com/), от леперов между прочим.

При сборке стандартным Kango, в FF могут возникать проблемы в виде кривого отображения попап окна. Это нормально, для сборки продакшен версии я использую чуть-чуть модифицированные сорцы компилятора.

Для интеграции различных юзерскриптов нужно добавить их в папку [./common/scripts](https://github.com/Rpsl/leprosorium/tree/master/common/scripts) и поправить формат автозапуска по шаблону:

```
// ==UserScript==
// @name		%script name%
// @namespace	leprosorium++youtubelinks <--- Очень важно указать свой namespace
// @author		%username%
// @include		http://*.leprosorium.ru/*
// @include		http://leprosorium.ru/*
// @require     zepto.js // если требуется
// ==/UserScript==

function main() {
    // body of script 
}

kango.invokeAsync('kango.storage.getItem', 'plugins', function(value){

    var name = 'mypluginname'; // как и на странице настроек ( options.html )

    if( value !== null && value.hasOwnProperty( name ) && value[ name ] == 1 )
    {
        // Запуск скрипта только если он включен в настройках
        main();
    }
});
```
После этого нужно отредактировать файл options.html, добавив в него пункт про включение юзерскрипта.

```
<p>Plugin name (by %username link%) <input class="plugin" type="checkbox" id="mypluginname" name="mypluginname" value="1"/></p>

```
