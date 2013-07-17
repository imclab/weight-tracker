/**
 * Wraps around the dial component. Essentially manages the user interactions
 * and passes the appropriate values to the dial. It also dispatches custom
 * events when the user taps on the value in the middle.
 *
 * Typically the users of this are WeightEntry and HeightEntry components, which
 * configure the DialEntry with the min / max values, colors and event names.
 * @license see /LICENSE
 */
WT.View.DialEntry = function(elementId) {

	var dial = new WT.View.Dial(elementId);
  var dialElement = document.getElementById(elementId);
  var dialElementX = dialElement.offsetLeft;
  var dialElementY = dialElement.offsetTop;
  var user = WT.App.getUser();
  var interactionStartEvent = null;
  var capturingValue = false;
  var changedValue = false;
  var startCaptureTimeout = 0;
  var startedCapture = false;
  var trackColor = false;
  var eventNameComplete = 'dialvaluecomplete';

	var callbacks = {

    startInteraction: function(evt) {

      evt.preventDefault();
      interactionStartEvent = evt;

      capturingValue = true;
      startedCapture = false;

      clearTimeout(startCaptureTimeout);
      startCaptureTimeout = setTimeout(callbacks.startValueEntry, 300);
    },

    startValueEntry: function() {
      dial.startTrackTo();
      startedCapture = true;
      callbacks.updateInteraction(interactionStartEvent, true);
    },

    updateInteraction: function(evt, ignoreForUserValue) {

      evt.preventDefault();

      if (capturingValue) {

        if (!startedCapture) {
          dial.startTrackTo();
          startedCapture = true;
          ignoreForUserValue = true;
        }

        var angle = getDialAngle(evt);
        var newAngle = angle / (Math.PI * 2);
        var newValue = dial.trackTo(newAngle, ignoreForUserValue);

        if (trackColor) {
          newValue = WT.App.convertToMetricIfNeeded('weight', newValue);
          dial.setDrawColor(WT.App.getWeightColor(newValue, user.height));
        }

        changedValue = true;
        clearTimeout(startCaptureTimeout);
      }

    },

    endInteraction: function(evt) {

      if (!!evt) {
        evt.preventDefault();
      }

      if (changedValue) {
        dial.stopTrackTo();
      } else {
        var newValue = dial.getValue();
        WT.App.dispatchEvent(dialElement, eventNameComplete, newValue);
      }

      clearTimeout(startCaptureTimeout);
      capturingValue = false;
      changedValue = false;
    }
  };

  function getDialAngle (evt) {
    var x = evt.offsetX;
    var y = evt.offsetY;
    var touches = evt.touches;

    if (typeof x === "undefined" && typeof touches === "undefined") {
      touches = [evt];
    }

    if (touches) {
      x = touches[0].pageX - dialElementX;
      y = touches[0].pageY - dialElementY;
    }

    var xDiff = x - 126;
    var yDiff = y - 126;

    return Math.atan2(yDiff, xDiff) + Math.PI * 2.5;

  }

  function addEventListeners () {

    dial.addEventListener('touchstart', callbacks.startInteraction, false);
    dial.addEventListener('touchmove', callbacks.updateInteraction, false);
    dial.addEventListener('touchend', callbacks.endInteraction, false);

    dial.addEventListener('mousedown', callbacks.startInteraction, false);
    dial.addEventListener('mousemove', callbacks.updateInteraction, false);
    dial.addEventListener('mouseup', callbacks.endInteraction, false);

  }

  function removeEventListeners () {

    dial.removeEventListener('touchstart', callbacks.startInteraction, false);
    dial.removeEventListener('touchmove', callbacks.updateInteraction, false);
    dial.removeEventListener('touchend', callbacks.endInteraction, false);

    dial.removeEventListener('mousedown', callbacks.startInteraction, false);
    dial.removeEventListener('mousemove', callbacks.updateInteraction, false);
    dial.removeEventListener('mouseup', callbacks.endInteraction, false);

  }

  this.show = function() {
    dialElement.classList.add('active');
    addEventListeners();
  };

  this.hide = function() {
    dialElement.classList.remove('active');
    removeEventListeners();
  };

  this.hideAndDispatch = function() {
    callbacks.endInteraction();
  };

  this.setup = function(options) {

    var rawValue = options.value;
    var value = options.value;
    var max = options.max;
    var label = options.label;
    var color = options.color;
    var eventName = options.eventName;
    var decimalPlaces = options.decimalPlaces;
    var ratio = options.ratio;
    var shouldTrackColor = options.trackColor;

    dial.setDecimalPlaces(decimalPlaces);
    dial.setRatio(ratio);
    dial.setMax(max);
    dial.setLabel(label);
    dial.setDrawColor(color);
    dial.animateTo(value);
    eventNameComplete = eventName;
    trackColor = shouldTrackColor;

    if (trackColor) {
        dial.setDrawColor(WT.App.getWeightColor(rawValue, user.height));
      }
  };

  this.clear = function() {
    dial.clear();
  };
};

WT.View.DialEntry.prototype = new WT.View.Base();
