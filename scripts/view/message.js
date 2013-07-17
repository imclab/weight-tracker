/**
 * Shows a message to the user, specifically the one relating to
 * landscape device orientation which asks them to rotate the device back.
 * @license see /LICENSE
 */
WT.View.Message = function(elementId) {

	var element = document.getElementById(elementId);

  this.setMessage = function (message) {
    element.classList.add(message);
  };

  this.hideMessage = function (message) {
    element.classList.remove(message);
  };

  this.show = function () {
    element.classList.add('active');
  };

  this.hide = function () {
    element.classList.remove('active');
  };
};

WT.View.Message.prototype = new WT.View.Base();
