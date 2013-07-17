/**
 * Controller for the message shown when the user turns the device on its side.
 * @license see /LICENSE
 */
WT.Controller.Message = function() {

  var elementId = 'message-view';
  var view = new WT.View.Message(elementId);
  var isShowing = false;

  this.init = function () {};

  this.setMessage = function (message) {

    switch (message) {
      case "pleaserotate":
        view.hideMessage("pleaseinstall");
        view.setMessage("pleaserotate");
        break;
      default:
        view.hideMessage("pleaserotate");
        view.setMessage("pleaseinstall");
        break;
    }

  };

  this.show = function() {
    if (!isShowing) {
      isShowing = true;
      view.show();
    }
  };

  this.hide = function() {
    isShowing = false;
    view.hide();
    view.hideMessage("pleaserotate");
    view.hideMessage("pleaseinstall");
  };
};

WT.Controller.Message.prototype = new WT.Controller.Base();
