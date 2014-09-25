/**
 *
 * Cube rendering
 *
 */
var cube = (function(){
	var canvas = document.getElementById('cube'),
		ctx = canvas.getContext('2d'),
		width = 102,
		height = 90,
		centerX = (width / 2),
		centerY = (height / 2) - 2,
		side = 20,
		perspective = 200,
		xStart = .45, yStart = .85, zStart = 0,
		xEnd = xStart, yEnd = yStart, zEnd = zStart,
		xRot = xStart, yRot = yStart, zRot = zStart,
		duration,
		startTime,
		mCos = Math.cos,
		mSin = Math.sin,
		mRound = Math.round,
		PI = Math.PI,
		animationTimer,
		initTimer,
		nextFrame = (function() {
		    return window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.oRequestAnimationFrame
				|| window.msRequestAnimationFrame
				|| function(callback) { return setTimeout(callback, 16.667); }
		})(),
		cancelFrame = (function () {
		    return window.cancelRequestAnimationFrame
				|| window.webkitCancelRequestAnimationFrame
				|| window.mozCancelRequestAnimationFrame
				|| window.oCancelRequestAnimationFrame
				|| window.msCancelRequestAnimationFrame
				|| clearTimeout
		})(),

		cube = [
			[-side, side, side, side, side, side, side, -side, side, -side, -side, side, 0, 0, 255],
			[-side, side, -side, side, side, -side, side, -side, -side, -side, -side, -side, 0, 0, -255],
			[side, side, side, side, side, -side, side, -side, -side, side, -side, side, 255, 0, 0],
			[-side, side, side, -side, side, -side, -side, -side, -side, -side, -side, side, -255, 0, 0],
			[-side, -side, side, side, -side, side, side, -side, -side, -side, -side, -side, 0, -255, 0],
			[-side, side, side, side, side, side, side, side, -side, -side, side, -side, 0, 255, 0]
		];
		
	function draw () {
		var rotation = [],
			x, y, z,
			r, g, b,
			i, l,
			color,
			easeOut,
			now = (new Date).getTime();

		for (i=0; i<6; i++) {
			rotation[i] = [];

			for (l=0; l<15; l+=3) {
				// X rotation
				x = cube[i][l];
				y = cube[i][l+1];
				z = cube[i][l+2];
				rotation[i][l] = x;
				rotation[i][l+1] = mCos(xRot) * y + mSin(xRot) * z;
				rotation[i][l+2] = mCos(xRot) * z - mSin(xRot) * y;

				// Y rotation
				x = rotation[i][l];
				y = rotation[i][l+1];
				z = rotation[i][l+2];
				rotation[i][l] = mCos(yRot) * x - mSin(yRot) * z;
				rotation[i][l+1] = y;
				rotation[i][l+2] = mCos(yRot) * z + mSin(yRot) * x;

				// Z rotation
				x = rotation[i][l];
				y = rotation[i][l+1];
				z = rotation[i][l+2];
				rotation[i][l] = mCos(zRot) * x - mSin(zRot) * y;
				rotation[i][l+1] = mCos(zRot) * y + mSin(zRot) * x;
				rotation[i][l+2] = z;
				
				// Perspective
				x = rotation[i][l];
				y = rotation[i][l+1];
				z = rotation[i][l+2];
				rotation[i][l] = (x * perspective) / (perspective - z);
				rotation[i][l+1] = (y * perspective) / (perspective - z);
				rotation[i][l+2] = z;
			}
		}

		ctx.clearRect(0,0, width, height);

		for (i=0; i<6; i++) {
			color = Math.round(rotation[i][14]);
			if (color > 255) color = 255;

			if (color > 22) {
				r = Math.round(color / 255 * 79);
				g = Math.round(color / 255 * 78);
				b = Math.round(color / 255 * 72);
				ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
				ctx.strokeStyle = 'rgb(24,24,22)';
				ctx.beginPath();
				ctx.moveTo(rotation[i][0] + centerX, rotation[i][1] + centerY);
				ctx.lineTo(rotation[i][3] + centerX, rotation[i][4] + centerY);
				ctx.lineTo(rotation[i][6] + centerX, rotation[i][7] + centerY);
				ctx.lineTo(rotation[i][9] + centerX, rotation[i][10] + centerY);
				ctx.lineTo(rotation[i][0] + centerX, rotation[i][1] + centerY);
				ctx.fill();
				ctx.stroke();
			}
		}

		if (now >= startTime + duration) {
			initTimer = setTimeout(init, 2500);
			return;
		}

		if (now < startTime + duration) animationTimer = nextFrame(draw);

		now = (now - startTime) / duration;

		ease = -.5 * (mCos(PI * now) - 1);
		xRot = ease * (xEnd - xStart) + xStart;
		yRot = ease * (yEnd - yStart) + yStart;
		zRot = ease * (zEnd - zStart) + zStart;
	}
	
	function init () {
		clearTimeout(initTimer);
		cancelFrame(animationTimer);

		xStart = xRot;
		yStart = yRot;
		zStart = zRot;
		xEnd = Math.random() * 20 + 5;
		yEnd = Math.random() * 20 + 5;
		zEnd = Math.random() * 20 + 5;
		duration = startTime ? 15000 / 25 * (Math.max(xEnd, yEnd, zEnd)) : 0;

		startTime = Date.now();

		draw();
	}
	
	canvas.onclick = init;
	
	return {
		init: init,
		stop: function () { clearTimeout(initTimer); cancelFrame(animationTimer); }
	}
})();

// Ignite!
cube.init();
window.addEventListener('load', function () { setTimeout(cube.init, 200); }, false);
