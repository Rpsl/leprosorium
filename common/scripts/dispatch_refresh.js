// ==UserScript==
// @name		Leprosorium dispatch refresh
// @namespace	leprosorium++refresh
// @author	    Rpsl
// @include		*.leprosorium.ru/*
// @include		*leprosorium.ru/*
// @include		*.leprosorium.com/*
// @include		*leprosorium.com/*

// ==/UserScript==

if(/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/comments\/(\d+)?(\/)(.*?)??$/.test(document.URL))
{
    kango.dispatchMessage('refresh', true);
}

if(/^https?:\/\/(\w+\.)?leprosorium\.(ru|com)\/my\/inbox\/(\d+)?(\/)?$/.test(document.URL))
{
    kango.dispatchMessage('refresh', true);
}