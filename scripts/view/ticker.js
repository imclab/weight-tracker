/**
 * Represents a single character in the ticker
 * @license see /LICENSE
 */
WT.View.TickerChar = function(x, y, isDot) {
  this.x = x || 0;
  this.y = y || 0;
  this.isDot = isDot || false;
};

/**
 * Represents the rolling ticker. Writes all the characters out to a sprite
 * canvas and then uses that draw into the main ticker canvas.
 * @license see /LICENSE
 */
WT.View.Ticker = function (elementId) {

	var CHAR_WIDTH = 70.5;
	var CHAR_GAP = 27;
  var WIDTH = 320;
  var HEIGHT = 110;
  var SPRITE_HEIGHT = HEIGHT * 10;

  var spriteCanvas = document.createElement('canvas');
  var spriteCtx = spriteCanvas.getContext('2d');
  var spriteImg = document.createElement('img');
	var canvas = document.getElementById(elementId);
	var ctx = canvas.getContext('2d');
  var animatedChars = [];
  var drawColor = WT.Colors.MEDIUM_GRAY;
  var label = "";
  var weightDifference = WT.Model.Settings.WEIGHT_NO_CHANGE;
  var textWidth = 0;
  var isFirstRun = false;
  var dPR = window.devicePixelRatio;

  (function init () {

    canvas.width = WIDTH * dPR;
    canvas.height = 257 * dPR;
    ctx.scale(dPR, dPR);

    canvas.style.width = WIDTH + 'px';
    canvas.style.height = '257px';

    spriteCanvas.width = CHAR_WIDTH * dPR;
    spriteCanvas.height = (SPRITE_HEIGHT + HEIGHT) * dPR;

    spriteCtx.scale(dPR, dPR);

  })();

  function addEventListener(name, bubbles, cancelable) {
    canvas.addEventListener(name, bubbles, cancelable);
  }

  function removeEventListener(name, bubbles, cancelable) {
    canvas.removeEventListener(name, bubbles, cancelable);
  }

  function setWeightDifference (newWeightDifference) {
    weightDifference = newWeightDifference;
  }

  function setLabel (newLabel) {
    label = newLabel.toUpperCase();
  }

  function setIsFirstRun (newIsFirstRun) {
    isFirstRun = newIsFirstRun;
  }

  function writeSpriteCanvas () {

    var LETTER_SPACING = 34;
    var PADDING = 135;

    spriteCtx.clearRect(0, 0, CHAR_WIDTH, SPRITE_HEIGHT + HEIGHT);
    spriteCtx.font = "127px roboto-thin";
    spriteCtx.fillStyle = drawColor;
    spriteCtx.textAlign = "left";
    spriteCtx.textBaseline = "alphabetic";

    for (var i = 0; i <= 10; i++) {

      var index = (i % 10).toString(10);
      var y = SPRITE_HEIGHT - (HEIGHT * i) - LETTER_SPACING + PADDING;

      // Fill in the background with white. This seems to resolve a rendering
      // bug on some Android handsets.
      spriteCtx.fillText(index, 0, y);
      spriteCtx.beginPath();
      spriteCtx.fillStyle = "white";
      spriteCtx.fillRect(0, y - HEIGHT, CHAR_WIDTH, HEIGHT + 5);
      spriteCtx.closePath();

      spriteCtx.beginPath();
      spriteCtx.fillStyle = drawColor;
      spriteCtx.fillText(index, 0, y);
      spriteCtx.closePath();
    }

    // Push this out to an image because it seems to perform better than
    // using a canvas directly. May be due to pixel readback.
    spriteImg.src = spriteCanvas.toDataURL("image/png");
  }

  function getLeft(weight) {

    var measurement = null;

    ctx.font = "127px roboto-thin";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = drawColor;

    measurement = ctx.measureText(weight, WIDTH * 0.5, HEIGHT * 0.5);
    textWidth = measurement.width;

    // reset
    ctx.textAlign = "left";

    return (WIDTH - textWidth) * 0.5;
  }

  function setDrawColor (color) {
    drawColor = color;
  }

	function animateTo (weight) {

    var weightChars = null;

    var charToWrite = null;
    var charToWriteAsNumber = 0;
    var charX = 0;
    var charY = 0;
    var isDot = false;
    var tween = null;
    var lastCharToWriteAsNumber = 0;

    weight = weight.toString();
    weightChars = weight.split("");
    charX = getLeft(weight);
    TWEEN.removeAll();
    writeSpriteCanvas();
    animatedChars.length = 0;

    for (var i = 0; i < weightChars.length; i++) {
      charToWrite = weightChars[i];
      charY = 0;
      isDot = (charToWrite === ".");

      if (!isDot) {
        charToWriteAsNumber = parseInt(charToWrite, 10);
        charY = (HEIGHT * 10) - charToWriteAsNumber * HEIGHT;
        charY -= lastCharToWriteAsNumber * (HEIGHT * 10);

        lastCharToWriteAsNumber = charToWriteAsNumber;
      }

      tween = new TWEEN.Tween({
        x: charX,
        y: SPRITE_HEIGHT,
        isDot: isDot
      });

      tween
        .to({ y: charY }, 1500 + (100 * i))
        .easing(TWEEN.Easing.Quintic.InOut)
        .onComplete(onCharAnimationComplete)
        .start();

      charX += isDot ? CHAR_GAP : CHAR_WIDTH;
    }

    requestAnimFrame(animate);

	}

  function animate() {

    var tweens = TWEEN.getAll();
    var charToDraw = null;
    var i = 0;
    var weightDifferenceColor = WT.Colors.MEDIUM_GRAY;
    var settingsVals = WT.Model.SettingsVals;
    var x = (WIDTH + textWidth) * 0.5 + 10;
    var base = 85;
    var point = 97;

    TWEEN.update();
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (i = 0; i < tweens.length; i++) {
      charToDraw = tweens[i].object();
      drawChar(charToDraw);
    }

    for (i = 0; i < animatedChars.length; i++) {
      charToDraw = animatedChars[i];
      drawChar(charToDraw);
    }

    ctx.save();
    ctx.fillStyle = WT.Colors.WHITE;
    ctx.fillRect(0, 110, WIDTH, 257 - HEIGHT);
    ctx.restore();

    ctx.save();
    ctx.font = "21px roboto-bold";
    ctx.textAlign = "center";
    ctx.fillStyle = WT.Colors.MEDIUM_GRAY;
    ctx.fillText(label, WIDTH * 0.5, HEIGHT + 16);
    ctx.restore();

    if (weightDifference !== settingsVals.WEIGHT_NO_CHANGE) {
      if (weightDifference === settingsVals.WEIGHT_INCREASE) {
        weightDifferenceColor = WT.Colors.RED;
        base = 97;
        point = 85;
      }
      else {
        weightDifferenceColor = WT.Colors.GREEN;
      }

      ctx.save();
      ctx.fillStyle = weightDifferenceColor;

      ctx.beginPath();
      ctx.moveTo(x, base);
      ctx.lineTo(x - 6, point);
      ctx.lineTo(x - 12, base);
      ctx.closePath();

      ctx.fill();
      ctx.restore();
    }

    // Add a message for the first run telling the user they can tap on
    // the ticker to update their weight.
    if (isFirstRun) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = WT.Colors.BLUE;
      ctx.moveTo(160, 175);
      ctx.lineTo(154, 163);
      ctx.lineTo(148, 175);
      ctx.closePath();
      ctx.fill();

      ctx.font = "16px roboto-bold";
      ctx.textAlign = "center";
      ctx.fillText("TAP TO CHANGE", WIDTH * 0.5, 190);
      ctx.restore();
    }

    if (tweens.length)
      requestAnimFrame(animate);
  }

  function drawChar (charToDraw) {
    var charX = Math.round(charToDraw.x);
    var charY = Math.round(charToDraw.y);
    var scaleDown = 1 / dPR;

    if (charToDraw.isDot) {
      ctx.fillText(".", charX, Math.round(HEIGHT * 0.5) - 5);
    } else {

      // Loop the canvas if necessary.
      while (charY < 0) {
        charY += (HEIGHT * 10);
      }

      ctx.save();
      ctx.scale(scaleDown, scaleDown);
      ctx.drawImage(spriteImg, charX * dPR, -(charY * dPR));
      ctx.restore();
    }

  }

  function onCharAnimationComplete() {
    animatedChars.push(
      new WT.View.TickerChar(this.x, this.y, this.isDot)
    );
  }

	return {
		animateTo: animateTo,
    setDrawColor: setDrawColor,
    setLabel: setLabel,
    setWeightDifference: setWeightDifference,
    setIsFirstRun: setIsFirstRun,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
	};
};
