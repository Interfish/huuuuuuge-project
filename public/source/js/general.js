/*
 * Developer : Claudio Ferraro (claudioferraro@mail.ru)
 * Date : 26/03/2013
 * All code (c)2013 Sunbyte inc. (Latvia) all rights reserved
 */

$(function() {

	$('.site-div').width(window.innerWidth - 17);

	$(window).resize(function() {
		$(".site-div").width($(window).width() - 17);
	});

	// initial scroll positioning
	$(window).one("scroll",function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;

	});

});
