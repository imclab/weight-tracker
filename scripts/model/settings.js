/**
 * Handles the data for the user's settings, such as how they like to store
 * their values. Uses the base model prototype to ensure default values are
 * used when no actual user data exists.
 * @license see /LICENSE
 */
WT.Model.Settings = function() {

  var settingsVals = WT.Model.SettingsVals;

	this.isFirstRun = true;
  this.unitsHeight = settingsVals.UNITS_HEIGHT_METRIC;
  this.unitsWeight = settingsVals.UNITS_WEIGHT_METRIC;

  /**
   * Loads in the user data from localStorage
   */
	this.restore = function() {
		this.isFirstRun = this.ensureValue(
			window.localStorage.getItem('isFirstRun'), "true", "bool");

    this.unitsHeight = this.ensureValue(
      window.localStorage.getItem('unitsHeight'),
      settingsVals.UNITS_HEIGHT_METRIC, "int");

    this.unitsWeight = this.ensureValue(
      window.localStorage.getItem('unitsWeight'),
      settingsVals.UNITS_WEIGHT_METRIC, "int");
	};

  /**
   * Pushes out the user data to localStorage
   */
	this.save = function() {
		window.localStorage.setItem('isFirstRun', this.isFirstRun);
    window.localStorage.setItem('unitsHeight', this.unitsHeight);
    window.localStorage.setItem('unitsWeight', this.unitsWeight);
	};

};

WT.Model.Settings.prototype = new WT.Model.Base();

/**
 * Enumeration constants for the various settings
 */
WT.Model.SettingsVals = {
  UNITS_HEIGHT_METRIC: 1,
  UNITS_HEIGHT_IMPERIAL: 2,
  UNITS_WEIGHT_METRIC: 4,
  UNITS_WEIGHT_IMPERIAL: 8,

  METRES_TO_INCHES: 39.3700787,
  KILOGRAMS_TO_POUNDS: 2.20462,

  DECIMALS_WEIGHT_METRIC: 1,
  DECIMALS_WEIGHT_IMPERIAL: 0,

  DECIMALS_HEIGHT_METRIC: 2,
  DECIMALS_HEIGHT_IMPERIAL: 0,

  WEIGHT_NO_CHANGE: 0,
  WEIGHT_INCREASE: 1,
  WEIGHT_DECREASE: 2
};
