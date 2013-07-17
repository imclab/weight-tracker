/**
 * The model for the user.
 * @license see /LICENSE
 */
WT.Model.User = function () {

  this.height = 1.5;
  this.weight = "50.0";
  this.lastWeight = "0.0";
  this.goalWeight = "0.0";

  this.save = function() {
    window.localStorage.setItem('height', this.height);
    window.localStorage.setItem('weight', this.weight);
    window.localStorage.setItem('lastWeight', this.lastWeight);
    window.localStorage.setItem('goalWeight', this.goalWeight);
  };

  this.restore = function() {
    this.height = this.ensureValue(
      window.localStorage.getItem('height'), 1.5, "float");

    this.weight = this.ensureValue(
      window.localStorage.getItem('weight'), "50.0", "string");

    this.lastWeight = this.ensureValue(
      window.localStorage.getItem('lastWeight'), "0.0", "string");

    this.goalWeight = this.ensureValue(
      window.localStorage.getItem('goalWeight'), "0.0", "string");
  };
};

WT.Model.User.prototype = new WT.Model.Base();
