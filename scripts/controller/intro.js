/**
 * Controller for the introduction view.
 * @license see /LICENSE
 */
WT.Controller.Intro = function() {

  var elementId = 'intro-view';
  var view = new WT.View.Intro(elementId);

  this.init = function () {};

  this.show = function() {
    view.show();
  };

  this.hide = function() {
    view.hide();
  };
};

WT.Controller.Intro.prototype = new WT.Controller.Base();
