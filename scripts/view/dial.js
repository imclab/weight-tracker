/**
 * Represents the dial component. Grabs the canvas element from the DOM and
 * provides functions for manipulating the dial values and draw color. Used
 * primarily by the DialEntry component, which adds a layer of semantic value
 * to the values being passed in.
 *
 * @license see /LICENSE
 */
WT.View.Dial = function(elementId) {

  var WIDTH = 258;
  var HEIGHT = 258;
  var HALF_WIDTH = WIDTH * 0.5;
  var HALF_HEIGHT = HEIGHT * 0.5;
  var TWO_PI = Math.PI * 2;
  var QUARTER_PI = Math.PI * 0.5;
  var PADDING = 1000;

	var canvas = document.getElementById(elementId);
	var ctx = canvas.getContext('2d');
  var drawColor = "";
  var requestScheduled = false;
  var drawStart = 1;
  var drawEnd = 1;
  var drawTargetStart = 1;
  var drawTargetEnd = 1;
  var easeValue = 0.35;
  var currentAngle = 1;
  var userValue = 0;
  var maxValue = 140;
  var decimalPlaces = 1;
  var ratio = 5;
  var label = "";

  (function init() {

    var dPR = window.devicePixelRatio;

    canvas.width = WIDTH * dPR;
    canvas.height = HEIGHT * dPR;
    ctx.scale(dPR, dPR);

    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';

  })();

  function addEventListener(name, bubbles, cancelable) {
    canvas.addEventListener(name, bubbles, cancelable);
  }

  function removeEventListener(name, bubbles, cancelable) {
    canvas.removeEventListener(name, bubbles, cancelable);
  }

  function setDecimalPlaces (newDecimalPlaces) {
    decimalPlaces = newDecimalPlaces;
  }

  function setRatio (newRatio) {
    ratio = newRatio;
  }

  function setMax (newMaxValue) {
    maxValue = newMaxValue;
  }

  function setLabel (newLabel) {
    label = newLabel.toUpperCase();
  }

  function setDrawColor (color) {
    drawColor = color;
  }

  function getValue () {
    return userValue.toFixed(decimalPlaces);
  }

  function startTrackTo () {
    currentAngle = Math.floor(userValue) + PADDING;

    drawTargetStart = currentAngle;
    drawTargetEnd = currentAngle +
      Math.max(0, Math.min(1, userValue / maxValue));

    drawStart = drawTargetStart;
    drawEnd = drawTargetEnd;
  }

  function trackTo (newAngle, ignoreForuserValue) {

    var distanceClockwise = (currentAngle - newAngle) % 1;
    var distanceAnticlockwise = (1 - distanceClockwise) % 1;

    // We now check which is nearer to the current value:
    // the clockwise or anticlockwise distance.
    if (distanceAnticlockwise < distanceClockwise) {
      currentAngle += distanceAnticlockwise;

      if (!ignoreForuserValue)
        userValue += distanceAnticlockwise * ratio;

    } else {
      currentAngle -= distanceClockwise;

      if (!ignoreForuserValue)
        userValue -= distanceClockwise * ratio;
    }

    // Set the beginning and end value to be a small amount either side
    // of the current angle.
    drawTargetStart = currentAngle - 0.05;
    drawTargetEnd = currentAngle + 0.05;

    // Constrain the values to something sensible.
    userValue = Math.max(userValue, 0);
    currentAngle = Math.max(currentAngle, 0.75);
    drawTargetStart = Math.max(drawTargetStart, 0.75);
    drawTargetEnd = Math.max(drawTargetEnd, 0.75);

    easeValue = 0.6;

    if (!requestScheduled) {
      requestAnimFrame(draw);
      requestScheduled = true;
    }

    return userValue;
  }

  function stopTrackTo () {
    animateTo(userValue);
  }

  function animateTo (weight) {

    if (!requestScheduled) {
      requestAnimFrame(draw);
      requestScheduled = true;
    }

    userValue = parseFloat(weight);

    drawTargetStart = Math.floor(currentAngle);
    drawTargetEnd = Math.floor(currentAngle) +
      Math.max(0, Math.min(1, weight / maxValue));

    easeValue = 0.12;
  }

  function draw () {

    requestScheduled = false;

    drawStart += (drawTargetStart - drawStart) * easeValue;
    drawEnd += (drawTargetEnd - drawEnd) * easeValue;

    clear();
    drawGrayBase();
    drawColorArea();
    drawCenter();
    drawText();

    if (Math.abs(drawTargetStart - drawStart) > 0.001 ||
      Math.abs(drawTargetEnd - drawEnd) > 0.001) {
      requestScheduled = true;
      requestAnimFrame(draw);
    }
  }

  function clear () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function drawCenter () {
    ctx.fillStyle = WT.Colors.WHITE;
    ctx.beginPath();
    ctx.arc(HALF_WIDTH, HALF_HEIGHT, 81, 0, TWO_PI, true);
    ctx.closePath();
    ctx.fill();
  }

  function drawText () {
    ctx.fillStyle = drawColor;
    ctx.font = "56px roboto-thin";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(userValue.toFixed(decimalPlaces), HALF_WIDTH,
        HALF_HEIGHT - 10);

    ctx.fillStyle = WT.Colors.MEDIUM_GRAY;
    ctx.font = "16px roboto-bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, HALF_WIDTH, HALF_HEIGHT + 26);
  }

  function drawGrayBase () {

    var radius = HALF_WIDTH - 2;

    ctx.fillStyle = WT.Colors.LIGHT_GRAY;
    ctx.beginPath();
    ctx.moveTo(HALF_WIDTH, HALF_HEIGHT);
    ctx.lineTo(WIDTH, HALF_HEIGHT);
    ctx.arc(HALF_WIDTH, HALF_HEIGHT, radius, 0, TWO_PI, false);
    ctx.closePath();
    ctx.fill();
  }

  function drawColorArea () {

    var startAngle = drawStart * TWO_PI - QUARTER_PI;
    var endAngle = drawEnd * TWO_PI - QUARTER_PI;
    var radius = HALF_WIDTH - 2;

    startAngle %= TWO_PI;
    endAngle %= TWO_PI;

    ctx.fillStyle = drawColor;
    ctx.beginPath();
    ctx.moveTo(HALF_WIDTH, HALF_HEIGHT);
    ctx.lineTo(HALF_WIDTH + Math.floor(Math.cos(startAngle) * radius),
        HALF_HEIGHT + Math.floor(Math.sin(startAngle) * radius));

    ctx.arc(HALF_WIDTH, HALF_HEIGHT, radius,
      startAngle,
      endAngle, false);
    ctx.lineTo(HALF_WIDTH, HALF_HEIGHT);
    ctx.closePath();
    ctx.fill();

  }

  return {
    animateTo: animateTo,
    setDecimalPlaces: setDecimalPlaces,
    setRatio: setRatio,
    setMax: setMax,
    setLabel: setLabel,
    setDrawColor: setDrawColor,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    startTrackTo: startTrackTo,
    trackTo: trackTo,
    stopTrackTo: stopTrackTo,
    getValue: getValue,
    clear: clear
  };

};
