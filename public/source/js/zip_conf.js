// zipper default settings
var backcolor = 'blue';
var backImage = '';
var lineColor = '#333333';   // default
var toothFill = '#d1d3d4';  // default
var pullFill = '#FFFFFF'; // default
var CursorFill = '#999999';  // default
var endingsFill = '#FFFFFF'; // default
var autoOpen = false;
var autoOpenSpeed = 100; // from 1 to 1000
var noAnimation = false;
var fadeOutAnimation = true;
var moveOutAnimation = false;
var fadeOutDelay = 1700; // milliseconds
//var zipperHeight = 100
$(function() {
	// INITIALIZATION ROUTINE
	if (backImage != '') {
		var backObj = new Image();
		backObj.src = backImage;
		backObj.onload = function() {
			init();
			fillPattern = ctx.createPattern(backObj, "repeat");
		}
	} else {
		init();
	}
});