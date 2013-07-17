/**
 * The base class for the model.
 * @license see /LICENSE
 */
WT.Model.Base = function() {};

WT.Model.Base.prototype = {
  /**
   * Helper function to ensure that a value exists for a given property and,
   * where it does not, gives it the default value.
   */
  ensureValue: function (value, defaultValue, type) {
    if (value === null || typeof value === 'undefined') {
      value = defaultValue;
    }

    switch (type) {
      case "bool":
        value = (value === "true"); break;
      case "float":
        value = parseFloat(value); break;
      case "int":
        value = parseInt(value, 10); break;
    }

    return value;
  }
};
