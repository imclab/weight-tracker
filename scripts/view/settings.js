/**
 * Handles the user settings. Dispatches custom events back to WT.App with
 * the updated settings values for storage.
 *
 * @license see /LICENSE
 */
WT.View.Settings = function(elementId) {

  // TODO(aerotwist) Move a lot of this out to the controller.

	var element = document.getElementById(elementId);
  var elementInner = element.querySelector('.inner');
  var heightChangeView = new WT.View.HeightEntry('height-entry-view');
  var closeButton = element.querySelector('#back-bar a');
  var resetButton = element.querySelector('#resetall');
  var changeHeightButton = element.querySelector('#changeheight');
  var options = element.querySelectorAll('.options a');
  var dispatchEventTimeout = 0;
  var settingChanged = false;

  var callbacks = {
    onCloseConfirm: function (evt) {
      evt.preventDefault();
      slideOut();
      clearTimeout(dispatchEventTimeout);
      dispatchEventTimeout = setTimeout(callbacks.onSlideOutComplete, 200);
    },

    onSlideOutComplete: function () {
      WT.App.dispatchEvent(element, 'settingscomplete', {
        settingChanged: settingChanged
      });
    },

    onResetConfirm: function (evt) {
      evt.preventDefault();

      if (confirm ("Are you sure you'd like to reset everything?")) {
        WT.App.dispatchEvent(element, 'resetalldata');
      }
    },

    onHeightChangeInit: function (evt) {
      evt.preventDefault();
      var user = WT.App.getUser();

      heightChangeView.show();
      heightChangeView.showUserHeight(user);

      settingChanged = true;
    },

    onHeightChangeComplete: function (evt) {
      heightChangeView.hide();
    },

    onOptionSelect: function (evt) {
      evt.preventDefault();
      var target = evt.target;
      var optionGroup = target.parentNode;
      var optionsInGroup = optionGroup.querySelectorAll('a');
      var optionTarget = optionGroup.dataset.target;
      var optionValue = target.dataset.value;

      if (!target.classList.contains('selected')) {

        for (var o = 0; o < optionsInGroup.length; o++) {
          optionsInGroup[o].classList.remove('selected');
        }

        target.classList.add('selected');
        settingChanged = true;

        WT.App.dispatchEvent(element, 'updatedsetting', {
          target: optionTarget,
          value: optionValue
        });
      }
    }
  };

  function setButtons() {

    var settings = WT.App.getSettings();
    var settingsVals = WT.Model.SettingsVals;
    var option = null;

    for (var o = 0; o < options.length; o++) {

      option = options[o];

      switch(option.dataset.value) {

        case "metres":
          if (settings.unitsHeight === settingsVals.UNITS_HEIGHT_METRIC)
            option.classList.add('selected');
          break;

        case "inches":
          if (settings.unitsHeight === settingsVals.UNITS_HEIGHT_IMPERIAL)
            option.classList.add('selected');
          break;

        case "kilograms":
          if (settings.unitsWeight === settingsVals.UNITS_WEIGHT_METRIC)
            option.classList.add('selected');
          break;

        case "pounds":
          if (settings.unitsWeight === settingsVals.UNITS_WEIGHT_IMPERIAL)
            option.classList.add('selected');
          break;
      }
    }
  }

  function addEventListeners () {

    window.addEventListener('heightreadingcomplete',
        callbacks.onHeightChangeComplete, false);

    resetButton.addEventListener('click', callbacks.onResetConfirm, false);
    resetButton.addEventListener('touchend', callbacks.onResetConfirm, false);

    changeHeightButton.addEventListener('click',
        callbacks.onHeightChangeInit, false);
    changeHeightButton.addEventListener('touchend',
        callbacks.onHeightChangeInit, false);

    closeButton.addEventListener('click', callbacks.onCloseConfirm, false);
    closeButton.addEventListener('touchend', callbacks.onCloseConfirm, false);

    for (var o = 0; o < options.length; o++) {
      options[o].addEventListener('click', callbacks.onOptionSelect, false);
      options[o].addEventListener('touchend', callbacks.onOptionSelect, false);
    }
  }

  function removeEventListeners () {

    window.removeEventListener('heightreadingcomplete',
        callbacks.onHeightChangeComplete, false);

    resetButton.removeEventListener('click', callbacks.onResetConfirm, false);
    resetButton.removeEventListener('touchend',
        callbacks.onResetConfirm, false);

    closeButton.removeEventListener('click', callbacks.onCloseConfirm, false);
    closeButton.removeEventListener('touchend',
        callbacks.onCloseConfirm, false);

    for (var o = 0; o < options.length; o++) {
      options[o].removeEventListener('click', callbacks.onOptionSelect, false);
      options[o].removeEventListener('touchend',
          callbacks.onOptionSelect, false);
    }
  }

  this.show = function () {
    settingChanged = false;
    clearTimeout(dispatchEventTimeout);
    element.classList.add('active');
    slideIn();
    setButtons();
    addEventListeners();
  };

  this.hide = function () {
    element.classList.remove('active');
    removeEventListeners();
  };

  function slideIn () {
    elementInner.classList.add('active');
  }

  function slideOut () {
    elementInner.classList.remove('active');
  }
};

WT.View.Settings.prototype = new WT.View.Base();
