/**
 * A base object for all controllers. Guarantees some methods exist, but
 * will throw warnings if they're not overwritten
 * @license see /LICENSE
 */
WT.Controller.Base = function() {
	this.name = "Base";
};

WT.Controller.Base.prototype = {
	show: function() {
		console.warn("Expected override of controller show()");
	},

	hide: function() {
		console.warn("Expected override of controller hide()");
	},

	init: function() {
		console.warn("Expected override of controller init()");
	},

	updateUser: function() {
		console.warn("Expected override of controller updateUser()");
	}
};
