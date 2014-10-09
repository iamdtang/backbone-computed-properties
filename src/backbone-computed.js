(function(Backbone) {

	Backbone.Computed = function() {
		if (this instanceof Backbone.Computed) {
			var args = Array.prototype.slice.call(arguments, 0);
	    this.computedFunction = args[args.length - 1];
	    this.dep = args.slice(0, -1);
		}
	};

	Backbone.Computed.prototype.getDependentProperties = function() {
		return this.dep;
	};

	var OriginalBackboneModel = Backbone.Model;

	Backbone.Model = OriginalBackboneModel.extend({
		constructor: function() {
			OriginalBackboneModel.apply(this, arguments);
			this._initializeComputedProperties();
		}
	});

	Backbone.Model.prototype._initializeComputedProperties = function() {
		var prototypeMember;
		var prototype = Object.getPrototypeOf(this);

		for (var key in prototype) {
			prototypeMember = prototype[key];

			if (prototypeMember instanceof Backbone.Computed) {
				this.set(key, prototypeMember.computedFunction.call(this));
				this._setupComputedPropertyBindings(key, prototypeMember);
			}
		}
	};

	Backbone.Model.prototype._setupComputedPropertyBindings = function(computedPropertyName, backboneComputed) {
		var self = this;
		var dep = backboneComputed.getDependentProperties().map(function(prop) {
			return 'change:' + prop;
		});

		var depEventString = dep.join(' ');
		this.on(depEventString, function() {
			var newValue = backboneComputed.computedFunction.call(self);
			self.set(computedPropertyName, newValue);
		}, this);
	};

})(Backbone);