/**
 * Represents the main view that shows the user's current weight.
 * @license see /LICENSE
 */
WT.View.Main = function(elementId) {

	var ticker = new WT.View.Ticker('weightticker');
  var element = document.getElementById(elementId);
  var tickerElement = document.getElementById('weightticker');
  var settingsButton = document.getElementById('settings');
  var setGoalButton = document.getElementById('setgoal');

  var callbacks = {
    onTickerPressed: function (evt) {

      // The canvas is larger (for HW accel) than
      // we'd like, so ignore taps > 110px from the top
      if (evt.pageY < tickerElement.offsetTop + 110) {
        WT.App.dispatchEvent(element, 'weightreadinginit');
      }

      evt.preventDefault();
    },

    onSettingsButtonPressed: function (evt) {
      WT.App.dispatchEvent(element, 'settingsinit');
      evt.preventDefault();
    },

    onGoalButtonPressed: function (evt) {
      WT.App.dispatchEvent(element, 'weightgoalinit');
      evt.preventDefault();
    }
  };

  function addEventListeners () {
    ticker.addEventListener('click', callbacks.onTickerPressed, false);
    ticker.addEventListener('touchend', callbacks.onTickerPressed, false);

    settingsButton.addEventListener('click',
        callbacks.onSettingsButtonPressed, false);
    settingsButton.addEventListener('touchend',
        callbacks.onSettingsButtonPressed, false);

    setGoalButton.addEventListener('click',
        callbacks.onGoalButtonPressed, false);
    setGoalButton.addEventListener('touchend',
        callbacks.onGoalButtonPressed, false);
  }

  function removeEventListeners () {
    ticker.removeEventListener('click', callbacks.onTickerPressed, false);
    ticker.removeEventListener('touchend', callbacks.onTickerPressed, false);

    settingsButton.removeEventListener('click',
        callbacks.onSettingsButtonPressed, false);
    settingsButton.removeEventListener('touchend',
        callbacks.onSettingsButtonPressed, false);

    setGoalButton.removeEventListener('click',
        callbacks.onGoalButtonPressed, false);
    setGoalButton.removeEventListener('touchend',
        callbacks.onGoalButtonPressed, false);
  }

	this.showUserWeight = function(user) {

    var label = 'weight';
    var userWeight = parseFloat(user.weight);
    var value = WT.App.convertToImperialIfNeeded(label, userWeight);
    var lastWeight = parseFloat(user.lastWeight);
    var weightDifference = WT.Model.SettingsVals.WEIGHT_NO_CHANGE;
    var goalWeight = parseFloat(user.goalWeight);
    var settings = WT.App.getSettings();

    if (lastWeight > 0) {
      var numericWeightDifference = lastWeight - userWeight;
      if (numericWeightDifference > 0) {
        weightDifference = WT.Model.SettingsVals.WEIGHT_DECREASE;
      } else if (numericWeightDifference < 0) {
        weightDifference = WT.Model.SettingsVals.WEIGHT_INCREASE;
      }
    }

    ticker.setIsFirstRun(settings.isFirstRun);
    ticker.setLabel(WT.App.getFullLabel(label));
    ticker.setDrawColor(WT.App.getWeightColor(user.weight, user.height));
    ticker.animateTo(value);
    ticker.setWeightDifference(weightDifference);

    setGoalButton.classList.remove('success');

    if (goalWeight > 0) {
      var goalWeightDifference =
        WT.App.convertToImperialIfNeeded(label, userWeight - goalWeight);

      if (goalWeightDifference <= 0) {
        setGoalButton.classList.add('success');
        setGoalButton.textContent = "Wahey! You reached your goal!";
      } else {
        setGoalButton.textContent = goalWeightDifference + " " +
        WT.App.getFullLabel(label) + " to your goal!";
      }

    } else {
      setGoalButton.textContent = "Would you like to set a goal?";
    }

	};

  this.show = function() {
    element.classList.add('active');
    addEventListeners ();
  };

  this.hide = function() {
    element.classList.remove('active');
    removeEventListeners ();
  };

};

WT.View.Main.prototype = new WT.View.Base();
