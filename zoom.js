/*********************************************
Image Zoom and Pan
*********************************************/

//Display, hide, and zoom up to 3 different images
function zoom(x) {
	document.getElementById("zoom").style.top = "41px";
	if (x == "thumbimage1") {
		document.getElementById("fullimage1").className = "displayimage";
	}
	if (x == "thumbimage2") {
		document.getElementById("fullimage2").className = "displayimage";
	}
	if (x == "thumbimage3") {
		document.getElementById("fullimage3").className = "displayimage";
	}
}

var a, b, c, i, normalArray, imageClass;
var listen = document.getElementById("zoom");
a = document.getElementById("fullimage1");
b = document.getElementById("fullimage2");
c = document.getElementById("fullimage3");
normalArray = [a, b, c];

//Scroll image above window
function exit() {
	document.getElementById("zoom").style.top = "-1500px";
	for (i = 0; i < normalArray.length; i++) {
		imageClass = normalArray[i];
		if (imageClass.className == "displayimage") {
			imageClass.className = "hideimageafter";
		}
	}
}

//Hide image after close link is clicked to keep from showing if another thumbnail is selected
listen.addEventListener("transitionend", done);
function done() {
	for (i = 0; i < normalArray.length; i++) {
		imageClass = normalArray[i];
		if (imageClass.className == "hideimageafter") {
			imageClass.className = "hideimage";
		}
	}
}

//Zoom and drag on desktop
//To zoom in once
function zoomIn(y) {
		if (y.style.cursor == "pointer") {
			return;
		}
		var newWidth = 1.6 * y.offsetWidth; // Aspect ratio
		y.style.minWidth = "100%"; //Some images did not fill container after zooming.  Moving image was not smooth.
		y.style.maxWidth = "50000%"; //Max-width in CSS was blocking image from re-sizing
		y.style.width = newWidth + "px"; //Set new width of image
		y.style.cursor = "pointer";
		y.style.paddingTop = "0px";
}

//To drag image once zoomed in
function dragStart(z, mouseIsDown) {
	if (z.style.cursor !== "pointer") {
		return;
	}
	else {
		var mouseX = mouseIsDown.clientX //Mouse X coordinate from browser window
		var mouseY = mouseIsDown.clientY; //Mouse Y coordinate from browser window
		var imageX = z.offsetLeft; //Image X coordinate from container div#zoom
		var imageY = z.offsetTop; //Image Y coordinate from container div#zoom
		document.addEventListener("mousemove", whenMouseMoves, true);
		document.addEventListener("mouseup", whenMouseReleased, true);
		mouseIsDown.preventDefault();
		function whenMouseMoves(zTwo) {
			z.style.left = imageX + (zTwo.clientX - mouseX) + "px";
			z.style.top = imageY + (zTwo.clientY - mouseY) + "px";
		}
		function whenMouseReleased(zThree) {
			document.removeEventListener("mousemove", whenMouseMoves, true);
			document.removeEventListener("mouseup", whenMouseReleased, true);
		}
	}
}
//End desktop zoom and drag

//Hide image with Escape key
document.addEventListener("keydown", checkKey);
function checkKey(anEvent) {
	if (anEvent.keyCode == 27) {
		exit();
	}
}

//Mobile section, needs to be cleaned up.  Add touch event listeners
//Very similar to mouse event listeners
a.addEventListener("touchstart", findCoordinates);
var alreadyZoomed;
function findCoordinates(mobileTouch) {
	mobileTouch.preventDefault();
	var helpDone;
	var alreadyMoved; //Defined in moveImage function to keep from zooming after move but allows for zoom on tap with no movement
	var placement = mobileTouch.targetTouches[0];
	var mobileX1 = placement.clientX; //Touch X coordinate
	var mobileY1 = placement.clientY; //Touch Y coordinate
	var imageCoordsX = a.offsetLeft;
	var imageCoordsY = a.offsetTop;
	a.addEventListener("touchmove", moveImage);
	a.addEventListener("touchend", zoomInMobile);
	//Not removing event listeners, working fine without removing
	function zoomInMobile() {
		if (alreadyZoomed == 1) { //Make sure it can be zoomed only once
			return;
		}
		if (alreadyMoved == 1) {
			if (document.getElementById("exit").className !== "normal") {
				showHelp = document.getElementById("exit");
				showHelp.className = "help";
				helpDone = 1;
				window.setTimeout(hideHelp, 3000);
				function hideHelp() {
					showHelp.className = "normal"; //Only setting class to "normal" to avoid showing help over and over
				}
			}
			return;
		}
		else {
			var originalWidth = a.offsetWidth; //Image is keeping aspect ratio w/o changing height
			var newWidth = 1.6 * originalWidth;
			a.style.minWidth = "100%"; //Some images did not fill container after zooming.  Moving image was not smooth.
			a.style.maxWidth = "50000%"; //Max-width in CSS was blocking image from re-sizing
			a.style.width = newWidth + "px"; //Set new width of image
			a.style.paddingTop = "0px";
			alreadyZoomed = 1;
		}
		return alreadyZoomed;
	}

	function moveImage(mobileMove) {
		mobileMove.preventDefault(); //Prevents scrolling
		var placement2 = mobileMove.targetTouches[0];
		var mobileX2 = placement2.clientX; //Movement X coordinate
		var mobileY2 = placement2.clientY; //Movement Y coordinate
		a.style.left = imageCoordsX + (mobileX2 - mobileX1) + "px";
		a.style.top = imageCoordsY + (mobileY2 - mobileY1) + "px";
		alreadyMoved = 1;
	}
}

