/*
 * Developer : Claudio Ferraro (claudioferraro@mail.ru)
 * Date : 26/03/2013
 * All code (c)2013 Sunbyte inc. (Latvia) all rights reserved
 * Version: 1.01
 */

var resizeTimer;
$(window).resize(function() {
	clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reinit, 100);
});

function reinit() {
    // reinit if resizing
	var ZipperContainer = curveCanvas.parentNode;

	if (ZipperContainer.tagName == 'BODY') {
		containerWidth = window.innerWidth;
		containerHeight = window.innerHeight;
	} else {
		containerWidth = ZipperContainer.offsetWidth;
		containerHeight = ZipperContainer.offsetHeight;
	}
	CurveLeft = (containerWidth / 2) - scrollBarWidth;
	CurveLength = containerHeight - 40;

	clearRect(ctx, 0,0, null, null);
	clearRect(ctxOver, 0,0, null, null);
	clearRect(ctxBack, 0,0, null, null);

	init();
};

function init() {
	ctx = document.getElementById('canvas').getContext('2d');
	ctxOver = document.getElementById('overlapcanvas').getContext('2d');
	ctxBack = document.getElementById('canvasback').getContext('2d');
	ctx.scale(1.0, 1.0);
	ctxOver.scale(1.0, 1.0);
	curveCanvas = document.getElementById('canvas');
	baseCanvas = document.getElementById('overlapcanvas');
	backCanvas = document.getElementById('canvasback');

	var ZipperContainer = curveCanvas.parentNode;

	if (ZipperContainer.tagName == 'BODY') {
		containerWidth = window.innerWidth;
		containerHeight = window.innerHeight;
	} else {
		containerWidth = ZipperContainer.offsetWidth;
		containerHeight = ZipperContainer.offsetHeight;
	}

	if (isTouchSupported) {
		baseCanvas.addEventListener('touchstart', myDown);
		baseCanvas.addEventListener('touchend', myUp);
		baseCanvas.addEventListener('touchmove', myMove);
		baseCanvas.onmousedown = myDown;
		baseCanvas.onmouseup = myUp;
		baseCanvas.onmousemove = myMove;
	} else {
		baseCanvas.onmousedown = myDown;
		baseCanvas.onmouseup = myUp;
		baseCanvas.onmousemove = myMove;
	}

	baseCanvas.onmouseout = myOut;

	curveCanvas.width = containerWidth;
	baseCanvas.width = containerWidth;
	backCanvas.width = containerWidth;

	curveCanvas.height = containerHeight;
	baseCanvas.height = containerHeight;
	backCanvas.height = containerHeight;

	CurveLeft = (containerWidth / 2) - scrollBarWidth;
	CurveLength = 0;

	if (typeof(zipperHeight) !== 'undefined') {
		CurveLength = zipperHeight;
	} else {
		CurveLength = containerHeight - 40;
	}
	NumOfTooths = (CurveLength / PointsPerTooth);

	tmpnegative = 0;
	tmpnegative2 = 0;
	cursorAdjust = 0;
	first = CurveLength / 5.225;
	second = CurveLength / 9.646;
	third = CurveLength / 2.411;


	lP = new LeftPath();
	rP = new RightPath();

	VarOL = new p(lP.pO.X, lP.pO.Y);  // store the origin of the path left for further usage
	VarCpL = new p(0,0);
	VarCpL2 = new p(0,0);
	VarEndpL = new p(0, CurveLength);

	OldVarOL = new p(lP.pO.X, lP.pO.Y);
	OldVarEndpL = new p(0, CurveLength);
	VarOR = new p(rP.pO.X, rP.pO.Y);
	VarCpR = new p(0,0);
	VarCpR2 = new p(0,0);
	VarEndpR = new p(0, CurveLength);
	OldVarOR = new p(rP.pO.X, rP.pO.Y);
	OldVarEndpR = new p(0, CurveLength);

	// events
	x = lP.pO.X-6;
	y = lP.pO.Y;
	oldy = y;
	startY = lP.pO.Y;
	endY = CurveLength - 40;
	offsetY = 0;
	baseWIDTH = 18 * CursorScaleX;
	baseHEIGHT = 35 * CursorScaleY;
	dragok = false;
	moved = false;

	drawBaseCursor(lP.pO.X-6, lP.pO.Y);
	moveZipper(true, false);

	if (autoOpen) {
		autoOpenInterval = self.setInterval(function() { autoOpenDraw(); }, 1000 / autoOpenSpeed);
	}
}

//var zipper
var isTouchSupported = 'ontouchstart' in window;

var ctx = null;
var ctxOver = null;
var ctxBack = null;

var curveCanvas = null;
var baseCanvas = null;
var backCanvas = null;
var fillPattern = null;

var containerWidth = 0;
var containerHeight = 0;


var scrollBarWidth = 17;
var CurveLeft = 0;
var CurveLength = 0;


var NumOfTooths = 0;
var PointsPerTooth = 15;

var CursorScaleX = 2.0;
var CursorScaleY = 2.0;


// points initialization
var lP = null;
var rP = null;

var counter = 0;
var VarOL = null;  // store the origin of the path left for further usage
var VarCpL = null;
var VarCpL2 = null;
var VarEndpL = null;

var OldVarOL = null;
var OldVarEndpL = null;

var VarOR = null;
var VarCpR = null;
var VarCpR2 = null;
var VarEndpR = null;

var OldVarOR = null;
var OldVarEndpR = null;

var autoOpenInterval = null;

// GRAPHICAL ELEMENTS.
var finalRect = function(ctx, size) {
	ctx.beginPath();
	if (size != 'big') {
		ctx.rect(0, 3, 19, 11);
	} else {
		ctx.rect(1, -2, 31, 16);
	}
	ctx.fillStyle = endingsFill;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = ColorLuminance(colourNameToHex(endingsFill), -0.5);
	ctx.stroke();
}


var BaseCursor = function(ctxOver) {
	ctxOver.save();
	ctxOver.fillStyle = CursorFill;
	ctxOver.strokeStyle = ColorLuminance(colourNameToHex(CursorFill), -0.5);
	ctxOver.lineWidth = 0.25;
	ctxOver.miterLimit = 3.8636999130249023;
	ctxOver.beginPath();
	ctxOver.moveTo(5.667,5.509);
	ctxOver.bezierCurveTo(3.9259999999999997,7.5200000000000005,2.7369999999999997,10.455,2.4749999999999996,13.788);
	ctxOver.bezierCurveTo(2.4389999999999996,14.248000000000001,2.4199999999999995,14.715,2.4199999999999995,15.188);
	ctxOver.bezierCurveTo(2.4199999999999995,19.198,4.358,20.25,5.690999999999999,22.066000000000003);
	ctxOver.bezierCurveTo(6.387999999999999,23.016000000000002,6.918999999999999,24.176000000000002,6.918999999999999,26.080000000000002);
	ctxOver.bezierCurveTo(6.918999999999999,28.631,6.872999999999998,30.701,7.4449999999999985,32.107);
	ctxOver.bezierCurveTo(7.704999999999998,32.748,8.091999999999999,33.248,8.671,33.597);
	ctxOver.bezierCurveTo(9.256,33.949,10.033999999999999,34.144,11.068999999999999,34.161);
	ctxOver.lineTo(11.151,34.159);
	ctxOver.lineTo(11.301,34.157);
	ctxOver.bezierCurveTo(12.296,34.132,13.049,33.94,13.620000000000001,33.599999999999994);
	ctxOver.bezierCurveTo(14.201,33.251999999999995,14.592,32.74999999999999,14.853000000000002,32.108);
	ctxOver.bezierCurveTo(15.427000000000001,30.703999999999997,15.382000000000001,28.630999999999997,15.382000000000001,26.078999999999997);
	ctxOver.bezierCurveTo(15.382000000000001,24.176,15.912,23.016,16.609,22.065999999999995);
	ctxOver.bezierCurveTo(17.94,20.247999999999994,19.880000000000003,19.197999999999997,19.880000000000003,15.186999999999996);
	ctxOver.bezierCurveTo(19.880000000000003,14.713999999999995,19.861000000000004,14.246999999999996,19.826000000000004,13.787999999999997);
	ctxOver.bezierCurveTo(19.563000000000002,10.455999999999996,18.376000000000005,7.518999999999997,16.635000000000005,5.506999999999996);
	ctxOver.bezierCurveTo(15.901000000000005,4.6569999999999965,15.067000000000005,3.9729999999999963,14.162000000000006,3.491999999999996);
	ctxOver.bezierCurveTo(13.260000000000007,3.010999999999996,12.285000000000005,2.734999999999996,11.269000000000005,2.6999999999999957);
	ctxOver.lineTo(11.150000000000006,2.7019999999999955);
	ctxOver.lineTo(11.068000000000005,2.7049999999999956);
	ctxOver.bezierCurveTo(10.000000000000005,2.7309999999999954,8.976000000000004,3.0279999999999956,8.034000000000006,3.5499999999999954);
	ctxOver.bezierCurveTo(7.171,4.029,6.374,4.693,5.667,5.509);
	ctxOver.lineTo(5.667,5.509);
	ctxOver.lineTo(5.667,5.509);
	ctxOver.closePath();
	ctxOver.fill();
	ctxOver.stroke();
	ctxOver.restore();
}


var PullPart = function(ctxOver, color) {
	ctxOver.save();

	if (color != null) {
		ctxOver.fillStyle = ColorLuminance(colourNameToHex(pullFill), -0.2);
	} else {
		ctxOver.fillStyle = pullFill;
	}
	ctxOver.strokeStyle = ColorLuminance(colourNameToHex(pullFill), -0.5);
	ctxOver.beginPath();
	ctxOver.moveTo(7.254,2.957);
	ctxOver.lineTo(6.004,11.738);
	ctxOver.bezierCurveTo(6.754,16.738,15.158999999999999,16.738,16.16,11.738);
	ctxOver.lineTo(15.035,2.956999999999999);
	ctxOver.lineTo(7.254,2.956999999999999);
	ctxOver.lineTo(7.254,2.957);
	ctxOver.closePath();
	ctxOver.moveTo(4.659,29.718);
	ctxOver.bezierCurveTo(4.659,32.167,7.541,34.153999999999996,11.097,34.153999999999996);
	ctxOver.bezierCurveTo(14.652,34.153999999999996,17.535,32.168,17.535,29.717999999999996);
	ctxOver.bezierCurveTo(17.535,27.267999999999994,14.652000000000001,25.281999999999996,11.097000000000001,25.281999999999996);
	ctxOver.bezierCurveTo(7.541,25.283,4.659,27.269,4.659,29.718);
	ctxOver.lineTo(4.659,29.718);
	ctxOver.closePath();
	ctxOver.moveTo(5.135,1.497);
	ctxOver.lineTo(16.924999999999997,1.497);
	ctxOver.lineTo(19.24,29.289);
	ctxOver.bezierCurveTo(19.592,37.85,2.4689999999999976,37.99,2.818999999999999,29.289);
	ctxOver.lineTo(5.135,1.497);
	ctxOver.lineTo(5.135,1.497);
	ctxOver.closePath();
	ctxOver.fill();
	ctxOver.stroke();
	ctxOver.restore();
};

var Hook = function(ctxOver) {
	ctxOver.save();
	ctxOver.fillStyle = "#ffffff";
	ctxOver.strokeStyle = "#000000";
	ctxOver.lineWidth = 0.25;
	ctxOver.miterLimit = 3.8636999130249023;
	ctxOver.beginPath();
	ctxOver.moveTo(2.651,5.144);
	ctxOver.bezierCurveTo(2.651,3.5780000000000003,3.694,2.309,4.981999999999999,2.309);
	ctxOver.lineTo(4.981999999999999,2.309);
	ctxOver.bezierCurveTo(6.268999999999999,2.309,7.312999999999999,3.5780000000000003,7.312999999999999,5.144);
	ctxOver.lineTo(7.312999999999999,15.432);
	ctxOver.bezierCurveTo(7.312999999999999,16.997,6.268999999999998,18.266000000000002,4.981999999999999,18.266000000000002);
	ctxOver.lineTo(4.981999999999999,18.266000000000002);
	ctxOver.bezierCurveTo(3.693999999999999,18.266000000000002,2.6509999999999994,16.997000000000003,2.6509999999999994,15.432000000000002);
	ctxOver.lineTo(2.6509999999999994,5.144);
	ctxOver.lineTo(2.651,5.144);
	ctxOver.closePath();
	ctxOver.fill();
	ctxOver.stroke();
	ctxOver.restore();
}


var Tooth = function(ctx) {
	ctx.fillStyle = toothFill;
	ctx.strokeStyle = ColorLuminance(colourNameToHex(toothFill), -0.5);
	ctx.lineWidth = 0.5799999833106995;
	ctx.miterLimit = 3.8636999130249023;
	ctx.beginPath();
	ctx.moveTo(3.665,2.577);
	ctx.bezierCurveTo(3.233,2.577,2.8440000000000003,2.911,2.8440000000000003,3.371);
	ctx.lineTo(2.8440000000000003,7.213);
	ctx.lineTo(2.8440000000000003,7.317);
	ctx.lineTo(2.8440000000000003,11.18);
	ctx.bezierCurveTo(2.8440000000000003,11.64,3.2330000000000005,11.974,3.665,11.974);
	ctx.lineTo(11.808,11.974);
	ctx.bezierCurveTo(12.259,11.974,12.651,11.723,12.915,11.556000000000001);
	ctx.bezierCurveTo(12.976999999999999,11.514000000000001,14.126,10.804,14.475,8.716000000000001);
	ctx.bezierCurveTo(14.597999999999999,8.695,14.721,8.695,14.844999999999999,8.695);
	ctx.lineTo(15.418999999999999,8.716000000000001);
	ctx.lineTo(15.623999999999999,8.758000000000001);
	ctx.lineTo(15.684,8.779000000000002);
	ctx.bezierCurveTo(15.950999999999999,9.009000000000002,15.994,9.490000000000002,16.096,10.011000000000001);
	ctx.bezierCurveTo(16.134,10.261000000000001,16.199,10.533000000000001,16.382,10.763000000000002);
	ctx.bezierCurveTo(16.546000000000003,10.992,16.835,11.159000000000002,17.200000000000003,11.180000000000001);
	ctx.lineTo(17.366000000000003,11.180000000000001);
	ctx.bezierCurveTo(17.898000000000003,11.201000000000002,18.431000000000004,10.951000000000002,18.761000000000003,10.325000000000001);
	ctx.bezierCurveTo(19.089000000000002,9.700000000000001,19.253000000000004,8.760000000000002,19.274000000000004,7.298000000000001);
	ctx.lineTo(19.274000000000004,7.275);
	ctx.lineTo(19.274000000000004,7.254);
	ctx.bezierCurveTo(19.253000000000004,5.770999999999999,19.089000000000006,4.831999999999999,18.761000000000003,4.225999999999999);
	ctx.bezierCurveTo(18.433,3.6,17.899,3.329,17.367,3.35);
	ctx.lineTo(17.201,3.35);
	ctx.bezierCurveTo(16.836000000000002,3.371,16.547,3.5380000000000003,16.383,3.7880000000000003);
	ctx.bezierCurveTo(16.115,4.142,16.096999999999998,4.54,16.032999999999998,4.916);
	ctx.bezierCurveTo(15.972999999999997,5.291,15.868999999999998,5.583,15.682999999999998,5.751);
	ctx.bezierCurveTo(15.661999999999997,5.793,15.211999999999998,5.855,14.843999999999998,5.8340000000000005);
	ctx.bezierCurveTo(14.719999999999997,5.8340000000000005,14.574999999999998,5.8340000000000005,14.473999999999998,5.8340000000000005);
	ctx.bezierCurveTo(14.123999999999999,3.8290000000000006,13.078999999999999,3.0780000000000007,12.934999999999999,2.9940000000000007);
	ctx.bezierCurveTo(12.666999999999998,2.8260000000000005,12.278999999999998,2.5760000000000005,11.806999999999999,2.5760000000000005);
	ctx.lineTo(3.665,2.577);
	ctx.lineTo(3.665,2.577);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

var ToothDX = function(ctx) {
	ctx.fillStyle = toothFill;
	ctx.strokeStyle = ColorLuminance(colourNameToHex(toothFill), -0.5);
	ctx.lineWidth = 0.5799999833106995;
	ctx.miterLimit = 3.8636999130249023;
	ctx.beginPath();
	ctx.moveTo(15.957,2.577);
	ctx.bezierCurveTo(16.389,2.577,16.776,2.911,16.776,3.371);
	ctx.lineTo(16.776,7.213);
	ctx.lineTo(16.776,7.317);
	ctx.lineTo(16.776,11.18);
	ctx.bezierCurveTo(16.776,11.64,16.387,11.974,15.957,11.974);
	ctx.lineTo(7.812,11.974);
	ctx.bezierCurveTo(7.361000000000001,11.974,6.969,11.723,6.705,11.556000000000001);
	ctx.bezierCurveTo(6.643,11.514000000000001,5.494,10.804,5.145,8.716000000000001);
	ctx.bezierCurveTo(5.021999999999999,8.695,4.898999999999999,8.695,4.7749999999999995,8.695);
	ctx.lineTo(4.201,8.716);
	ctx.lineTo(3.996,8.758);
	ctx.lineTo(3.936,8.779);
	ctx.bezierCurveTo(3.669,9.009,3.627,9.49,3.524,10.011);
	ctx.bezierCurveTo(3.485,10.261,3.422,10.533,3.238,10.763);
	ctx.bezierCurveTo(3.073,10.991999999999999,2.785,11.159,2.419,11.18);
	ctx.lineTo(2.254,11.18);
	ctx.bezierCurveTo(1.721,11.201,1.188,10.951,0.859,10.325);
	ctx.bezierCurveTo(0.531,9.698,0.366,8.758,0.347,7.296);
	ctx.lineTo(0.347,7.275);
	ctx.lineTo(0.347,7.254);
	ctx.bezierCurveTo(0.367,5.770999999999999,0.532,4.831999999999999,0.86,4.225999999999999);
	ctx.bezierCurveTo(1.188,3.6,1.721,3.329,2.254,3.35);
	ctx.lineTo(2.419,3.35);
	ctx.bezierCurveTo(2.785,3.371,3.073,3.5380000000000003,3.238,3.7880000000000003);
	ctx.bezierCurveTo(3.505,4.144,3.524,4.54,3.587,4.917);
	ctx.bezierCurveTo(3.6470000000000002,5.292,3.7520000000000002,5.584,3.9370000000000003,5.752);
	ctx.bezierCurveTo(3.958,5.794,4.407,5.856,4.776,5.835);
	ctx.bezierCurveTo(4.8999999999999995,5.835,5.045,5.835,5.146,5.835);
	ctx.bezierCurveTo(5.494,3.83,6.54,3.079,6.685,2.995);
	ctx.bezierCurveTo(6.952,2.827,7.340999999999999,2.577,7.813,2.577);
	ctx.lineTo(15.957,2.577);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}
// END OF GRAPHICAL ELEMENTS

// base point coordinates classes
function p(x, y) {
   this.X = x;
   this.Y = y;
}

function pa(x, y, a) {
   this.X = x;
   this.Y = y;
   this.a = a; //alpha tangent
}

function LeftPath() {
	this.pO = new p(CurveLeft, 0);
	this.cp1 = new p(0, 0);
	this.cp2 = new p(0, 0);
	this.endp = new p(0, CurveLength);

	this.CP1x = function(x) {
		this.cp1.X = x;
		return (this.pO.X + x);
	}
	this.CP1y = function(y) {
		this.cp1.Y = y;
		return (this.pO.Y + y);
	}
	this.CP2x = function(x) {
		this.cp2.X = x;
		return (this.pO.X + x);
	}
	this.CP2y = function(y) {
		this.cp2.Y = y;
		return (this.pO.Y + y);
	}
	this.Endx = function(x) {
		this.endp.X = x;
		return (this.pO.X + x);
	}
	this.Endy = function(y) {
		this.endp.Y = y;
		return (this.pO.Y + y);
	}
}

function RightPath() {
	this.pO = new p(CurveLeft + 32, 0);
	this.cp1 = new p(0, 0);
	this.cp2 = new p(0, 0);
	this.endp = new p(0, CurveLength);

	this.CP1x = function(x) {
		this.cp1.X = x;
		return (this.pO.X + x);
	}
	this.CP1y = function(y) {
		this.cp1.Y = y;
		return (this.pO.Y + y);
	}
	this.CP2x = function(x) {
		this.cp2.X = x;
		return (this.pO.X + x);
	}
	this.CP2y = function(y) {
		this.cp2.Y = y;
		return (this.pO.Y + y);
	}
	this.Endx = function(x) {
		this.endp.X = x;
		return (this.pO.X + x);
	}
	this.Endy = function(y) {
		this.endp.Y = y;
		return (this.pO.Y + y);
	}
}

// gets the point of the bezier curves, starting from t , starting, control points 1 and 2 and ending point		
function bezierInterpolation(t, o1, c1, c2, e1) {
	var C1 = (1-t) * (1-t) * (1-t);
	var C2 = 3.0 * t * ((1-t)*(1-t));
	var C3 = 3.0 * (t*t) * (1-t);
	var C4 = t * t * t;

	return ( (C1*o1) + (C2*c1) + (C3*c2) + (C4*e1));
}

function bezierPoint(t, o1, c1, c2, e1) {
	var C1 = (e1 - (3.0 * c2) + (3.0 * c1) - o1);
	var C2 = ((3.0 * c2) - (6.0 * c1) + (3.0 * o1));
	var C3 = ((3.0 * c1) - (3.0 * o1));
	var C4 = (o1);

	return ((C1*t*t*t) + (C2*t*t) + (C3*t) + C4)
}

// get the tangent angle for a given bezier curve
function bezierTangent(t, o1, c1, c2, e1) {
	var C1 = (e1 - (3.0 * c2) + (3.0 * c1) - o1);
	var C2 = ((3.0 * c2) - (6.0 * c1) + (3.0 * o1));
	var C3 = ((3.0 * c1) - (3.0 * o1));
	var C4 = (o1);

	return ((3.0 * C1 * t * t) + (2.0 * C2 * t) + C3);
}

// gets the point at a certain t
function getPAtLen(t, path) {
   var finalX = bezierPoint(t, path[0], path[2], path[4], path[6]);
   var finalY = bezierPoint(t, path[1], path[3], path[5], path[7]);
   var aX = bezierTangent(t, path[0], path[2], path[4], path[6]);
   var aY = bezierTangent(t, path[1], path[3], path[5], path[7]);
   var alpha = Math.atan2(aY, aX);
   return new pa(finalX, finalY, alpha);
}

// places all the Tooths on the curve
function placeToothsSXOnPath(path) {

	ctx.save();
	var Tarr = parameterizeCurveOpt(path, getArcLength(path) / NumOfTooths, 0);
	var oldtransX = 0, oldtransY = 0;
	var oldalpha = 0;
	var pOnCurve = 0
	// place zipper starting element
	pOnCurve = getPAtLen(0.0001, path);
	ctx.translate((pOnCurve.X), (pOnCurve.Y));
	ctx.rotate((-90 * (Math.PI/180))+ (pOnCurve.a));
	finalRect(ctx);
	ctx.rotate(90 * (Math.PI/180) - (pOnCurve.a));
	oldalpha = pOnCurve.a;
	oldtransX = pOnCurve.X;
	oldtransY = pOnCurve.Y;

	for (var j=0; j<Tarr.length; j++) {
	   pOnCurve = getPAtLen(Tarr[j], path);
	   ctx.translate((pOnCurve.X - oldtransX), (pOnCurve.Y - oldtransY));
	   ctx.rotate((-90 * (Math.PI/180))+ (pOnCurve.a));
	   Tooth(ctx);
	   ctx.rotate(90 * (Math.PI/180) - (pOnCurve.a));
	   oldalpha = pOnCurve.a;
	   oldtransX = pOnCurve.X;
	   oldtransY = pOnCurve.Y;
	}
	ctx.restore();
}

function placeToothsDXOnPath(path) {
	ctx.save();
	var Tarr = parameterizeCurveOpt(path, (getArcLength(path) / NumOfTooths), PointsPerTooth/2);
	var oldtransX = 0, oldtransY = 0;
	var oldalpha = 0;
	var pOnCurve = 0;
	var transSumX = 0, transSumY = 0;
	var transX = 0, transY = 0;

	for (var j=0; j<Tarr.length; j++) {
	   if (Tarr[j] >= 0) {
		   pOnCurve = getPAtLen(Tarr[j], path);

		   transX = pOnCurve.X - oldtransX;
		   transY = pOnCurve.Y - oldtransY;
		   transSumX = transSumX + transX;
		   transSumY = transSumY + transY;
		   ctx.translate(transX, transY);

		   ctx.rotate((-90 * (Math.PI/180))+ (pOnCurve.a));
		   ctx.translate(-20,0);
		   ToothDX(ctx);
		   ctx.translate(20,0);
		   ctx.rotate(90 * (Math.PI/180) - (pOnCurve.a));

		   oldalpha = pOnCurve.a;
		   oldtransX = pOnCurve.X;
		   oldtransY = pOnCurve.Y;
	   }
	}
	
	// draw the initial element
	pOnCurve = getPAtLen(0.0001, path);
	ctx.translate(-transSumX, -transSumY);
	ctx.translate(pOnCurve.X, pOnCurve.Y);
	ctx.rotate((-90 * (Math.PI/180))+ (pOnCurve.a));
	ctx.translate(-20,0);
	finalRect(ctx);
	ctx.translate(20,0);
	ctx.rotate(90 * (Math.PI/180) - (pOnCurve.a));
	ctx.restore();
}

// get the arc length of a given curve
function getArcLength(path) {

	var STEPS = 200; // > precision
	var t = 1 / STEPS;
	var aX=0;
	var aY=0;
	var bX=path[0], bY=path[1];
	var dX=0, dY=0;
	var dS = 0;
	var sumArc = 0;
	var j = 0;

	for (var i=0; i<STEPS; j = j + t) {
		aX = bezierPoint(j, path[0], path[2], path[4], path[6]);
		aY = bezierPoint(j, path[1], path[3], path[5], path[7]);

		dX = aX - bX;
		dY = aY - bY;
		// deltaS. Pitagora
		dS = Math.sqrt((dX * dX) + (dY * dY));
		sumArc = sumArc + dS;
		bX = aX;
		bY = aY;
		i++;
	}
	return sumArc;
}

// gets the arc of a subpart of a curve.
function getSegmentSizeOfCurve(startX, startY, path, endT) {
	var aX = 0, aY = 0;
	var dX=0, dY=0;
	aX = bezierPoint(endT, path[0], path[2], path[4], path[6]);
	aY = bezierPoint(endT, path[1], path[3], path[5], path[7]);

	dX = aX - startX;
	dY = aY - startY;
	// deltaS Pitagora
	return new Array(Math.sqrt((dX * dX) + (dY * dY)), aX, aY);
}

// gets a more precise array of t where each t corresponts to an equidistant point on the curve.
// places the tooths at regular intervals on the curve.. Optimized algorithm with binary search
function parameterizeCurveOpt(path, partArc, initialT) {
	var STEPS = 2000;
	var errRange = 0.00000001;
	var t = 1 / STEPS;
	var optt = (STEPS / NumOfTooths) * t;
	var aX=0;
	var aY=0;
	var bX=path[0], bY=path[1];
	var dX=0, dY=0;
	var dS = 0;
	var arrRes = null;
	var sumArc = 0;
	var arrT = new Array(Math.round(partArc));
	var z = 1;
	arrT[0] = -1;
	var shiftedAmount = 0;

	var oldpartArc = partArc;
	partArc = partArc - initialT;
	var j = optt;

	for (i=(STEPS / NumOfTooths); i<STEPS; j = j + optt + shiftedAmount) {

			arrRes = getSegmentSizeOfCurve(bX, bY, path, j);
			dS = arrRes[0];
			aX = arrRes[1];
			aY = arrRes[2];
			sumArc = dS;

			if (dS > (partArc)) {
				bX = aX;
				bY = aY;
				// find a better approximation
				var IhaveIt = false;
				while(IhaveIt == false) {
					j = j - t;
					arrRes = getSegmentSizeOfCurve(bX, bY, path, j);
					dS = arrRes[0];
					aX = arrRes[1];
					aY = arrRes[2];
					sumArc = sumArc - dS;

					if (sumArc <= partArc) {
						IhaveIt = true;
						break;
					}
					bX = aX;
					bY = aY;
					shiftedAmount = shiftedAmount - t;
				}
			} else {
				// save aX
				bX = aX;
				bY = aY;
				var IhaveIt = false;
				while(IhaveIt == false) {
					j = j + t;
					arrRes = getSegmentSizeOfCurve(bX, bY, path, j);
					dS = arrRes[0];
					aX = arrRes[1];
					aY = arrRes[2];
					sumArc = sumArc + dS;

					if (sumArc >= partArc) {
						IhaveIt = true;
						break;
					}
					bX = aX;
					bY = aY;
					shiftedAmount = shiftedAmount + t;
				}
			}
			arrT[z] = j; // save current t
			z++;
			sumArc = 0;
			partArc = oldpartArc;

		i = i + (STEPS / (NumOfTooths));
	}

	return arrT;
}

// OLD PARAMETERIZATION. Non optimized
function parameterizeCurve(path, partArc, initialT) {
	// curve lenght is already known and globally defined
	//brute force
	var STEPS = 5000; // > precision
	var t = 1 / STEPS;
	var aX=0;
	var aY=0;
	var bX=path[0], bY=path[1];
	var dX=0, dY=0;
	var dS = 0;
	var sumArc = 0;
	var arrT = new Array(Math.round(partArc));
	var z = 1;
	arrT[0] = -1;

	var oldpartArc = partArc;
	partArc = partArc - initialT;

	var j = 0;

	for (var i=0; i<STEPS; j = j + t) {
		aX = bezierPoint(j, path[0], path[2], path[4], path[6]);
		aY = bezierPoint(j, path[1], path[3], path[5], path[7]);

			dX = aX - bX;
			dY = aY - bY;
			// deltaS. Pitagora
			dS	= Math.sqrt((dX * dX) + (dY * dY));
			sumArc = sumArc + dS;
			if (sumArc >= partArc) {
				arrT[z] = j; // save current t
				z++;
				sumArc = 0;
				partArc = oldpartArc;
			}
		bX = aX;
		bY = aY;
		i++;
	}
	return arrT;
}

function newtonSqrt(input) {  // too slow.. Use Math.sqrt instead 
	var x = 1;
	for (var i = 0; i < 10; i++)
	x = x - ((x*x - input) / (2*x));
	return x;
}

function drawBezier(o1, o1y, c1, c1y, c2, c2y, e1, e1y) {
	for (var t=0; t<1.01; t=t+(0.002*15)) {
		var finalX = bezierPoint(t, o1, c1, c2, e1);
		var finalY = bezierPoint(t, o1y, c1y, c2y, e1y);
		ctx.beginPath();

		ctx.lineWidth = 5;
		ctx.strokeStyle = 'black';
		ctx.moveTo(finalX,finalY);
		ctx.lineTo(finalX+1,finalY+1);
		ctx.stroke();
	}
}

// draws the cursor and related stuff on the other canvas element
function drawBaseCursor(posX, posY, color) {
	ctxOver.save();
	clearRect(ctxOver, posX, 0, 80, window.innerHeight);

	ctxOver.translate(posX, posY);
	ctxOver.scale(CursorScaleX,CursorScaleY);
	BaseCursor(ctxOver);

	ctxOver.translate(0, 10);
	PullPart(ctxOver, color);

	ctxOver.translate(6, -7);
	Hook(ctxOver);

	//
	ctxOver.restore();
}

// clears the screen. general function for all canvas elements
function clearRect(context, posX, posY, width, height) {
	if (width != null) {
		context.clearRect(posX, posY, width, height);
	} else {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
}

var tmpnegative = 0;
var tmpnegative2 = 0;
var cursorAdjust = 0;

var first = 0;
var second = 0;
var third = 0;

// moves the zipper for a given step
function moveZipper(reset, invert, value, step) {

	var toggleValue = 1;
	if (invert) {
		toggleValue = -1;
	}

	var factor = 3.4;
	controlValue2 = (2 * (toggleValue * value)) / factor;
	controlValue1 = (1 * (toggleValue * value)) / factor;
	controlValue3 = (1.6 * (toggleValue * value)) / factor;

	clearRect(ctx, VarOL.X-20, VarOL.Y-20, VarOR.X-VarOL.X+40, (lP.Endy(VarEndpL.Y)-VarOL.Y)+20);
	clearRect(ctxBack, 0, VarOL.Y-20, window.innerWidth, window.innerHeight-(VarOL.Y-20));

	counter = counter+1;

		if (!reset) {
			VarOL.X = OldVarOL.X - controlValue2;
			VarOL.Y = OldVarOL.Y + controlValue1;
			lP.pO.X = VarOL.X;
			lP.pO.Y = VarOL.Y;
			VarCpL.X = controlValue2+cursorAdjust;
			VarCpL.Y = controlValue3; // switch to 1

			if (invert) {

				// begin
				if (controlValue2 < first) {
					if (tmpnegative2 >= -first) {
						tmpnegative2 = controlValue2 * -1;
					}
				}
				if(controlValue1 <= second && cursorAdjust >= 0) {
					cursorAdjust = controlValue1 / 5;
				}
				if (controlValue2 > first && controlValue2 < third) {
					tmpnegative2 = -first;
				}

				// end
				if (controlValue2 > third) {
					if (tmpnegative2 > -(first-1)) {
						tmpnegative2 = tmpnegative2 - step;
					}
				}

			} else {
				// begin
				if (controlValue2 < first) {
					if (tmpnegative2 > -first) {
						tmpnegative2 = controlValue2 * -1;
					}
				}
				if(controlValue1 <= second && cursorAdjust >= 0) {
					cursorAdjust = controlValue1 / 5;
				}
				// end
				if (controlValue2 > third) {
					if (tmpnegative2 < -10) {
						tmpnegative2 = tmpnegative2 + step;
					}
				}
			}
			VarCpL2.X = controlValue2;
			VarCpL2.Y = tmpnegative2+controlValue2;

			VarEndpL.X = OldVarEndpL.X + controlValue2;
			VarEndpL.Y = OldVarEndpL.Y - controlValue1;
		}
		// to absolute values
		var absPath = new Array(VarOL.X, VarOL.Y, lP.CP1x(VarCpL.X), lP.CP1y(VarCpL.Y), lP.CP2x(VarCpL2.X), lP.CP2y(VarCpL2.Y), lP.Endx(VarEndpL.X), lP.Endy(VarEndpL.Y));
		ctx.beginPath();
		ctx.lineWidth = 14;
		ctx.strokeStyle = lineColor;

		ctx.moveTo(VarOL.X, VarOL.Y );
		ctx.bezierCurveTo(absPath[2],absPath[3],absPath[4],absPath[5],absPath[6],absPath[7]);

		ctxBack.beginPath();
		ctxBack.moveTo(VarOL.X, VarOL.Y );
		ctxBack.bezierCurveTo(absPath[2]+1,absPath[3],absPath[4],absPath[5],absPath[6],absPath[7]);
		ctxBack.lineTo(0, absPath[7]);
		ctxBack.lineTo(0, absPath[1]);
		ctxBack.lineTo(VarOL.X, VarOL.Y);
		ctxBack.closePath();

		if (fillPattern != null) {
			ctxBack.fillStyle = fillPattern;
		} else {
			ctxBack.fillStyle = backcolor;
		}
		ctxBack.fill();
		ctxBack.stroke();

		ctx.stroke();

		placeToothsSXOnPath(absPath);

		if (!reset) {
			VarCpR.X = (controlValue2+cursorAdjust) * -1;
			VarCpR.Y = controlValue3;  //old 2 or 1

			VarCpR2.X = controlValue2 * -1;
			VarCpR2.Y = tmpnegative2 + controlValue2; // or 1

			VarOR.X = OldVarOR.X + controlValue2;
			VarOR.Y = OldVarOR.Y + controlValue1;
			rP.pO.X = VarOR.X;
			rP.pO.Y = VarOR.Y;

			VarEndpR.X = OldVarEndpR.X - controlValue2;
			VarEndpR.Y = OldVarEndpR.Y - controlValue1;
		}
		var absPath = new Array(VarOR.X, VarOR.Y, rP.CP1x(VarCpR.X), rP.CP1y(VarCpR.Y), rP.CP2x(VarCpR2.X), rP.CP2y(VarCpR2.Y), rP.Endx(VarEndpR.X), rP.Endy(VarEndpR.Y));

		// draw path2
		ctx.lineWidth = 14;
		ctx.beginPath();

		ctx.strokeStyle = lineColor;
		ctx.moveTo(VarOR.X, VarOR.Y);
		ctx.bezierCurveTo(rP.CP1x(VarCpR.X), rP.CP1y(VarCpR.Y), rP.CP2x(VarCpR2.X), rP.CP2y(VarCpR2.Y), rP.Endx(VarEndpR.X), rP.Endy(VarEndpR.Y));

		ctxBack.beginPath();
		ctxBack.moveTo(VarOR.X, VarOR.Y);
		ctxBack.bezierCurveTo(absPath[2],absPath[3],absPath[4],absPath[5],absPath[6],absPath[7]);
		ctxBack.lineTo(backCanvas.width, absPath[7]);
		ctxBack.lineTo(backCanvas.width, absPath[1]);
		ctxBack.lineTo(VarOR.X, VarOR.Y);
		ctxBack.closePath();

		if (fillPattern != null) {
			ctxBack.fillStyle = fillPattern;
		} else {
			ctxBack.fillStyle = backcolor;
		}
		ctxBack.fill();
		ctxBack.stroke();

		ctx.stroke();
		placeToothsDXOnPath(absPath);

	// draw base rect
	var endOfZipperY = lP.Endy(VarEndpL.Y) -1;
	var endOfZipperX = lP.Endx(VarEndpL.X) -1;

	ctx.save();
	ctx.translate(endOfZipperX, endOfZipperY-10);
	finalRect(ctx, 'big');

	ctx.restore();

	ctxBack.beginPath();
	ctxBack.moveTo(0, endOfZipperY);
	ctxBack.lineTo(backCanvas.width, endOfZipperY);
	ctxBack.lineTo(backCanvas.width, backCanvas.height);
	ctxBack.lineTo(0, backCanvas.height);
	ctxBack.closePath();
	if (fillPattern != null) {
		ctxBack.fillStyle = fillPattern;
	} else {
		ctxBack.fillStyle = backcolor;
	}

	ctxBack.fill();
}

// EVENTS
var x = 0;
var y = 0;
var oldy = 0;
var startY = 0;
var endY = 0;
var offsetY = 0;
var baseWIDTH = 18 * CursorScaleX;
var baseHEIGHT = 35 * CursorScaleY;
var dragok = false;
var moved = false;

function myOut(e) {
	leavingCursor();
	dragok = false;
}

function myMove(e){

    var pageX = 0;
	var pageY = 0;

	if (isTouchSupported) {
	    pageX = e.touches[0].pageX;
		pageY = e.touches[0].pageY;
	} else {
	    pageX = e.pageX;
		pageY = e.pageY;
	}


	if (dragok){

		moved = true;
		var newy = y - offsetY;
		y = pageY - baseCanvas.offsetTop;

		if (newy >= startY && newy <= endY ) {
			drawBaseCursor(x, newy, '#c1c1c1');
			if (newy != oldy) {
				// check direction
				if (newy > oldy) {
					moveZipper(false, false, newy - startY, newy - oldy);
				} else {
					moveZipper(false, true,startY - newy, oldy - newy);
				}
			}
		} else {
			if (newy < endY) {
				moveZipper(false, true, 0, 0);
				drawBaseCursor(x, startY, null);
			} else {
			   // end of cursor reached
				 animateZipper();
				 $('#containerZipper').trigger("zipper:end");
			}
		}
		oldy = newy;

	} else {

		if (!autoOpen) {
			if (pageX < x + baseWIDTH + baseCanvas.offsetLeft && pageX > x +
			baseCanvas.offsetLeft && pageY < y + baseHEIGHT + baseCanvas.offsetTop &&
			pageY > y + baseCanvas.offsetTop){
				drawBaseCursor(x, y, '#c1c1c1');
			} else {
				drawBaseCursor(x, y, null);
			}
		}
	}

	e.preventDefault();
}

function myDown(e){
    var pageX = 0;
	var pageY = 0;

	if (isTouchSupported) {
	    pageX = e.touches[0].pageX;
		pageY = e.touches[0].pageY;
	} else {
	    pageX = e.pageX;
		pageY = e.pageY;
	}

	if (pageX < x + baseWIDTH + baseCanvas.offsetLeft && pageX > x +
		baseCanvas.offsetLeft && pageY < y + baseHEIGHT + baseCanvas.offsetTop &&
		pageY > y + baseCanvas.offsetTop){

		offsetY = (pageY - baseCanvas.offsetTop) - y;

		y = pageY - baseCanvas.offsetTop;
		oldy = y;

		dragok = true;
		moved = false;
		return false;
	}
}

function myUp() {
	leavingCursor();
	dragok = false;
	return false;
}

function leavingCursor() {
	if (dragok){
	y = y - offsetY;
		if (y < lP.pO.Y) { y = lP.pO.Y; }
		if (y > endY) { y = endY; }
	}
}

function changeColor(color, texture) {
	if (texture == '') {
		fillPattern = null;
		backcolor = color;
		moveZipper(true, false);
	} else {
		backImage = texture;

		var backObj = new Image();
		backObj.src = texture;
		backObj.onload = function() {
			fillPattern = ctx.createPattern(backObj, "repeat");
			moveZipper(true, false);
		}
	}
}

function changeZipper(key, value) {
	switch (key) {
		case 'lineColor':
			lineColor = value;
			break;
		case 'toothFill':
			toothFill = value;
			break;
		case 'pullFill':
			pullFill = value;
			break;
		case 'endingsFill':
			endingsFill = value;
			break;

		case 'CursorFill':
			CursorFill = value;
			break;
	}
	drawBaseCursor(x, y);
	moveZipper(true, false);

}

function changeAnimation(key) {
	switch (key) {
		case 'fadeout':
			fadeOutAnimation = true;
			moveOutAnimation = false;
			noAnimation = false;
		break;

		case 'moveout':
			moveOutAnimation = true;
			fadeOutAnimation = false;
			noAnimation = false;
		break;

		case 'noani':
			noAnimation = true;
			moveOutAnimation = false;
			fadeOutAnimation = false;
		break;
	}
}


function ColorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

function colourNameToHex(colour)
{
	if (colour.indexOf("#") == -1) {
		var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
		"beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
		"cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
		"darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
		"darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
		"darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
		"firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
		"gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
		"honeydew":"#f0fff0","hotpink":"#ff69b4",
		"indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
		"lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
		"lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
		"lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
		"magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
		"mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
		"navajowhite":"#ffdead","navy":"#000080",
		"oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
		"palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
		"red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
		"saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
		"tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
		"violet":"#ee82ee",
		"wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
		"yellow":"#ffff00","yellowgreen":"#9acd32"};

		if (typeof colours[colour.toLowerCase()] != 'undefined')
			return colours[colour.toLowerCase()];

		} else {
			return colour;
		}
	return false;
}

var OpenStep = 10;
var OpenIndex = 0;

function autoOpenDraw() {

	//alert(OpenIndex);
	OpenIndex = OpenIndex + OpenStep;
	drawBaseCursor(x, OpenIndex, '#c1c1c1');
	moveZipper(false, false, OpenIndex, 10);

	if (OpenIndex > (containerHeight - 90)) {
		animateZipper();
		autoOpenInterval = window.clearInterval(autoOpenInterval);
	}
}


function animateZipper() {
	// animation
  if (!noAnimation) {
	  if (moveOutAnimation) {
		  $('#canvas').animate({'top': window.innerHeight+'px'}, fadeOutDelay);
		  $('#canvasback').animate({'top': window.innerHeight+'px'}, fadeOutDelay);
		  $('#overlapcanvas').animate({'top': window.innerHeight+'px'}, fadeOutDelay);
	  }
	  $('#canvas').fadeOut(fadeOutDelay);
	  $('#canvasback').fadeOut(fadeOutDelay);
	  $('#overlapcanvas').fadeOut(fadeOutDelay, function() {
			// end of animation
			$('body').css('overflow', 'visible');
		});
	}
}


