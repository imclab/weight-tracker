/**
 * Controller for the weight entry view.
 * @license see /LICENSE
 */
WT.Controller.WeightEntry = function() {

  var elementId = 'weight-entry-view';
  var view = new WT.View.WeightEntry(elementId);
  var user = WT.App.getUser();

  this.init = function () {};

  this.show = function() {
    view.show();
    view.clear();

    // Give a little time for the user to lift their finger
    // before showing the view. Otherwise we might catch some
    // inadvertent touch events.
    setTimeout(function() {
      view.showUserWeight(user);
    }, 500);
  };

  this.isCapturingGoal = function (isGoal) {
    view.isCapturingGoal(isGoal);
  };

  this.setEventName = function (newEventName) {
    view.setEventName(newEventName);
  };

  this.hide = function() {
    view.hide();
  };
};

WT.Controller.WeightEntry.prototype = new WT.Controller.Base();
