/**
 * Shows a dial entry for the user to enter their height. Will then dispatch
 * a custom event to the app with the value entered.
 *
 * @license see /LICENSE
 */
WT.View.HeightEntry = function(elementId) {

	var dialEntry = new WT.View.DialEntry("newheight");
  var element = document.getElementById(elementId);
  var confirmButton = element.querySelector('.next');
  var callbacks = {
    onWeightConfirm: function(evt) {
      evt.preventDefault();
      dialEntry.hideAndDispatch();
    }
  };

  function addEventListeners() {
    confirmButton.addEventListener('click', callbacks.onWeightConfirm, false);
    confirmButton.addEventListener('touchend', callbacks.onWeightConfirm, false);
  }

  function removeEventListeners() {
    confirmButton.removeEventListener('click', callbacks.onWeightConfirm, false);
    confirmButton.removeEventListener('touchend', callbacks.onWeightConfirm, false);
  }

  this.show = function() {
    element.classList.add('active');
    addEventListeners();
  };

  this.hide = function() {
    element.classList.remove('active');
    removeEventListeners();
  };

  this.showUserHeight = function (user) {

    var label = 'height';
    var max = WT.App.convertToImperialIfNeeded(label, 2.5);
    var value = WT.App.convertToImperialIfNeeded(label, user.height);
    var ratio = WT.App.convertToImperialIfNeeded(label, 0.4);

    dialEntry.show();
    dialEntry.setup({
      max: max,
      value: value,
      label: WT.App.getFullLabel(label),
      color: WT.Colors.BLUE,
      eventName: 'heightreadingcomplete',
      trackColor: false,
      decimalPlaces: WT.App.getDecimalPlaces(label),
      ratio: ratio
    });
  };
};

WT.View.HeightEntry.prototype = new WT.View.Base();
