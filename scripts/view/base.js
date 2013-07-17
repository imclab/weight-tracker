/**
 * A base object for all views. Ensures certain functions are available, but
 * will warn if they are called rather than overridden.
 * @license see /LICENSE
 */
WT.View.Base = function() {
	this.name = "Base";
};

WT.View.Base.prototype = {
	show: function() {
		console.warn("Expected override of view show()");
	},

	hide: function() {
		console.warn("Expected override of view hide()");
	},

	init: function() {
		console.warn("Expected override of view init()");
	}
};
