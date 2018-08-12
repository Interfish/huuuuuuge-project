// zipper default settings
var backcolor = '#ffbec7';
var backImage = '';
var lineColor = '#cccccc';   // default
var toothFill = '#cccccc';  // default
var pullFill = '#ffffff'; // default
var CursorFill = '#cccccc';  // default
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