(function(Backbone) {

	Backbone.Computed = function(args) {
		if (this instanceof Backbone.Computed) {
			args = Array.prototype.slice.call(args, 0);
	    this.computedFunction = args[args.length - 1];
	    this.dep = args.slice(0, -1);
		} else {
			return new Backbone.Computed(arguments);
		}
	};

	Backbone.Computed.prototype.getDependentProperties = function() {
		return this.dep;
	};

	var OriginalBackboneModel = Backbone.Model;

	Backbone.Model = OriginalBackboneModel.extend({
		constructor: function() {
			OriginalBackboneModel.apply(this, arguments);
			initializeComputedProperties.call(this);
		}
	});

	function initializeComputedProperties() {
		var prototypeMember;
		var prototype = Object.getPrototypeOf(this);

		for (var key in prototype) {
			if (prototype.hasOwnProperty(key)) {
				prototypeMember = prototype[key];

				if (prototypeMember instanceof Backbone.Computed) {
					this.set(key, prototypeMember.computedFunction.call(this));
					setupComputedPropertyBindings.call(this, key, prototypeMember);
				}
			}
		}
	}

	function setupComputedPropertyBindings(computedPropertyName, backboneComputed) {
		var self = this;
		var dependentProperties = backboneComputed.getDependentProperties();

		if (dependentProperties.length > 0) {
			var dep = dependentProperties.map(function(prop) {
				return 'change:' + prop;
			});

			var depEventString = dep.join(' ');
			
			this.on(depEventString, function() {
				var newValue = backboneComputed.computedFunction.call(self);
				self.set(computedPropertyName, newValue);
			}, this);
		}
	}

})(Backbone);