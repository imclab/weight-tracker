/**
 * The hub of the application. Receives the custom events and coordinates the
 * showing and hiding of the application views.
 * @license see /LICENSE
 */
WT.App = (function() {

  var mainController = null;
  var weightEntryController = null;
  var settingsController = null;
  var messageController = null;
  var user = null;
  var settings = null;
  var allowGoalSetting = true;
  var enableGoalTimeOut = 0;
  var callbacks = {

    onOrientationChange: function(evt) {

      if (evt.beta === null) {
        return;
      }

      var angle = Math.abs(evt.beta);
      if (angle <= 10) {
        messageController.setMessage("pleaserotate");
        messageController.show();
      } else {
        messageController.hide();
      }
    },

    onResize: function(evt) {

      // Should be an iOS device. Androids don't seem to have the orientation
      // property in the window object.
      if (typeof window.orientation !== "undefined") {
        if (window.orientation === 90 || window.orientation === -90) {
          messageController.setMessage("pleaserotate");
          messageController.show();
        } else {
          messageController.hide();
        }
      }
    },

    onResetAllData: function (evt) {
      // TODO(aerotwist) Find a nicer way to handle this.
      window.location.href = "?reset";
    },

    disableDefault: function (evt) {
      evt.preventDefault();
    },

    onSettingsInit: function () {
      settingsController.show();
    },

    onSettingsComplete: function (evt) {
      settingsController.hide();
      settings.save();

      if (evt.data.settingChanged)
        mainController.show();
    },

    onWeightReadingInit: function () {
      weightEntryController.setEventName('weightreadingcomplete');
      weightEntryController.isCapturingGoal(false);
      weightEntryController.show();
    },

    onWeightReadingComplete: function (evt) {

      var newWeight = convertToMetricIfNeeded("weight", evt.data);

      if (!settings.isFirstRun)
        user.lastWeight = user.weight;

      user.weight = newWeight;
      user.save();

      if (!settings.isFirstRun) {
        weightEntryController.hide();
        mainController.show();
      }
    },

    onWeightGoalInit: function () {

      if (allowGoalSetting) {
        weightEntryController.setEventName('weightgoalcomplete');
        weightEntryController.isCapturingGoal(true);
        weightEntryController.show();

        allowGoalSetting = false;
      }
    },

    onWeightGoalComplete: function (evt) {

      var newWeight = convertToMetricIfNeeded("weight", evt.data);
      user.goalWeight = newWeight;
      user.save();

      weightEntryController.hide();
      mainController.show();

      clearTimeout(enableGoalTimeOut);
      enableGoalTimeOut = setTimeout(callbacks.onAllowWeightGoalInit, 500);

    },

    onAllowWeightGoalInit: function () {
      allowGoalSetting = true;
    },

    onWeightGoalRemoved: function (evt) {
      callbacks.onWeightGoalComplete({
        data:"0.0"
      });
    },

    onHeightReadingComplete: function (evt) {

      var newHeight = convertToMetricIfNeeded("height", evt.data);

      user.height = newHeight;
      user.save();
    },

    onIntroComplete: function (evt) {

      introController.hide();

      // Add a timeout to make sure that the user doesn't accidentally
      // trigger the weight entry view to appear.
      setTimeout(function() {

        mainController.show();

        settings.isFirstRun = false;
        settings.save();

      }, 200);
    },

    onUpdatedSetting: function (evt) {

      var data = evt.data;
      var settingsVals = WT.Model.SettingsVals;

      getSettings();

      switch (data.target) {
        case "settings.unitsHeight":
          settings.unitsHeight = settingsVals.UNITS_HEIGHT_METRIC;
          if (data.value === "inches")
            settings.unitsHeight = settingsVals.UNITS_HEIGHT_IMPERIAL;
          break;

        case "settings.unitsWeight":
          settings.unitsWeight = settingsVals.UNITS_WEIGHT_METRIC;
          if (data.value === "pounds")
            settings.unitsWeight = settingsVals.UNITS_WEIGHT_IMPERIAL;
      }

      settings.save();
    }
  };

  function checkForiOSButNotStandalone () {
    if (typeof window.navigator.standalone !== "undefined") {
      if (!window.navigator.standalone) {
        document.body.scrollTop = 1;
      } else {
        document.ontouchstart = callbacks.disableDefault;
      }
    }
  }

  function dispatchEvent (element, eventName, data) {
    var evt = document.createEvent("Event");
    evt.initEvent(eventName, true, true);
    if(!!data) {
      evt.data = data;
    }
    element.dispatchEvent(evt);
  }

  function calculateBMI (weight, height) {
    return weight / (height * height);
  }

  function getWeightColor (weight, height) {

    var bodyMassIndex = calculateBMI(weight, height);
    var drawColor = WT.Colors.BLUE;

    if (bodyMassIndex > 18.5)
      drawColor = WT.Colors.GREEN;

    if (bodyMassIndex > 25)
      drawColor = WT.Colors.ORANGE;

    if (bodyMassIndex > 30)
      drawColor = WT.Colors.RED;

    return drawColor;
  }

  function getUser() {
    if (!user) {
      user = new WT.Model.User();
      user.restore();
      user.save();
    }

    return user;
  }

  function getSettings() {
    if (!settings) {
      settings = new WT.Model.Settings();
      settings.restore();
      settings.save();
    }

    return settings;
  }

  function addEventListeners () {
    document.body.onselectstart = callbacks.disableDefault;

    // Reset event.
    window.addEventListener('resetalldata', callbacks.onResetAllData, false);

    // Settings events.
    window.addEventListener('settingsinit', callbacks.onSettingsInit, false);
    window.addEventListener('settingscomplete',
        callbacks.onSettingsComplete, false);

    // Weight reading events.
    window.addEventListener('weightreadinginit',
        callbacks.onWeightReadingInit, false);
    window.addEventListener('weightreadingcomplete',
        callbacks.onWeightReadingComplete, false);
    window.addEventListener('weightgoalinit',
        callbacks.onWeightGoalInit, false);
    window.addEventListener('weightgoalcomplete',
        callbacks.onWeightGoalComplete, false);
    window.addEventListener('removegoal', callbacks.onWeightGoalRemoved, false);

    // Height reading event.
    window.addEventListener('heightreadingcomplete',
        callbacks.onHeightReadingComplete, false);

    // Other misc events.
    window.addEventListener('deviceorientation',
        callbacks.onOrientationChange, false);
    window.addEventListener('updatedsetting',
        callbacks.onUpdatedSetting, false);
    window.addEventListener('resize', callbacks.onResize, false);
    window.addEventListener('introcomplete', callbacks.onIntroComplete, false);
  }

  function getValue (label) {

    var value = 0;

    switch(label) {
      case "height":
        value = user.height;
        break;

      case "weight":
        value = user.weight;
        break;
    }

    return value;
  }

  function getFullLabel (label) {

    var settings = WT.App.getSettings();
    var settingsVals = WT.Model.SettingsVals;

    switch(label) {
      case "height":

        if(settings.unitsHeight === settingsVals.UNITS_HEIGHT_METRIC)
          label = "Metres";
        else
          label = "Inches";
        break;

      case "weight":
        if(settings.unitsWeight === settingsVals.UNITS_WEIGHT_METRIC)
          label = "Kilograms";
        else
          label = "Pounds";
        break;
    }

    return label;
  }

  function convertToImperialIfNeeded (label, value) {

    var settings = WT.App.getSettings();
    var settingsVals = WT.Model.SettingsVals;
    var convertedValue = parseFloat(value);
    var decimalPlaces = 2;

    switch (label) {
      case "height":

        decimalPlaces = settingsVals.DECIMALS_HEIGHT_METRIC;

        if(settings.unitsHeight === settingsVals.UNITS_HEIGHT_IMPERIAL) {
          convertedValue *= settingsVals.METRES_TO_INCHES;
          decimalPlaces = settingsVals.DECIMALS_HEIGHT_IMPERIAL;
        }

        break;

      case "weight":

        decimalPlaces = settingsVals.DECIMALS_WEIGHT_METRIC;

        if(settings.unitsWeight === settingsVals.UNITS_WEIGHT_IMPERIAL) {
          convertedValue *= settingsVals.KILOGRAMS_TO_POUNDS;
          decimalPlaces = settingsVals.DECIMALS_WEIGHT_IMPERIAL;
        }

        break;
    }

    return convertedValue.toFixed(decimalPlaces);

  }

  function convertToMetricIfNeeded (label, value) {

    var settings = WT.App.getSettings();
    var settingsVals = WT.Model.SettingsVals;
    var convertedValue = parseFloat(value);
    var decimalPlaces = 0;

    switch (label) {
      case "height":
        decimalPlaces = settingsVals.DECIMALS_HEIGHT_METRIC;
        if(settings.unitsHeight === settingsVals.UNITS_HEIGHT_IMPERIAL)
          convertedValue /= settingsVals.METRES_TO_INCHES;
        break;

      case "weight":
        decimalPlaces = settingsVals.DECIMALS_WEIGHT_METRIC;
        if(settings.unitsWeight === settingsVals.UNITS_WEIGHT_IMPERIAL)
          convertedValue /= settingsVals.KILOGRAMS_TO_POUNDS;
        break;
    }

    return convertedValue.toFixed(decimalPlaces);

  }

  function getDecimalPlaces (label) {

    var settings = WT.App.getSettings();
    var settingsVals = WT.Model.SettingsVals;
    var decimalPlaces = 0;

    switch(label) {

      case "height":
        // metres
        decimalPlaces = settingsVals.DECIMALS_HEIGHT_METRIC;

        // inches
        if(settings.unitsHeight === settingsVals.UNITS_HEIGHT_IMPERIAL)
          decimalPlaces = settingsVals.DECIMALS_HEIGHT_IMPERIAL;

        break;

      case "weight":

        // kilograms
        decimalPlaces = settingsVals.DECIMALS_WEIGHT_METRIC;

        // pounds
        if(settings.unitsWeight === settingsVals.UNITS_WEIGHT_IMPERIAL)
          decimalPlaces = settingsVals.DECIMALS_WEIGHT_IMPERIAL;
        break;
    }

    return decimalPlaces;
  }

	function init () {

    document.body.classList.remove('loading');

    addEventListeners();

    introController = new WT.Controller.Intro();
    introController.init();

    mainController = new WT.Controller.Main();
    mainController.init();

    weightEntryController = new WT.Controller.WeightEntry();
    weightEntryController.init();

    settingsController = new WT.Controller.Settings();
    settingsController.init();

    messageController = new WT.Controller.Message();
    messageController.init();

    getUser();
    getSettings();
    callbacks.onResize();
    checkForiOSButNotStandalone();

    if (settings.isFirstRun) {
      introController.show();
    } else {
      mainController.show();
    }
	}

	return {
		init: init,
    getSettings: getSettings,
    getUser: getUser,
    getWeightColor: getWeightColor,
    getValue: getValue,
    getFullLabel: getFullLabel,
    getDecimalPlaces: getDecimalPlaces,
    dispatchEvent: dispatchEvent,
    convertToImperialIfNeeded: convertToImperialIfNeeded,
    convertToMetricIfNeeded: convertToMetricIfNeeded
	};

})();

