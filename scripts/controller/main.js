/**
 * Controller for the main view containing the ticker.
 * @license see /LICENSE
 */
WT.Controller.Main = function() {

  var elementId = 'main-view';
  var view = new WT.View.Main(elementId);
  var user = WT.App.getUser();

  this.init = function () {};

  this.show = function () {
    view.show();
    view.showUserWeight(user);
	};
};

WT.Controller.Main.prototype = new WT.Controller.Base();
