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
			this._initializeComputedProperties();
		}
	});

	Backbone.Model.prototype._initializeComputedProperties = function() {
		var prototypeMember;
		var prototype = Object.getPrototypeOf(this);

		for (var key in prototype) {
			if (prototype.hasOwnProperty(key)) {
				prototypeMember = prototype[key];

				if (prototypeMember instanceof Backbone.Computed) {
					this.set(key, prototypeMember.computedFunction.call(this));
					this._setupComputedPropertyBindings(key, prototypeMember);
				}
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