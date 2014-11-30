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

	var ComputedPropertySetup = function(model, property, propertyName) {
		var dependentProperties = property.getDependentProperties();

		var computeValue = function() {
			model.set(propertyName, property.computedFunction.call(model));
		};

		var eventsToListen = function() {
			return dependentProperties.map(function(propertyName) {
				return 'change:' + propertyName;
			});
		};

		var attachListeners = function() {
			if (!dependentProperties.length) { return; }
			var eventString = eventsToListen().join(' ');
			model.on(eventString, computeValue);
		};

		attachListeners();
		computeValue();
	};

	function initializeComputedProperties() {
		var prototypeMember;
		var prototype = Object.getPrototypeOf(this);

		for (var key in prototype) {
			if (prototype.hasOwnProperty(key)) {
				prototypeMember = prototype[key];

				if (prototypeMember instanceof Backbone.Computed) {
					ComputedPropertySetup(this, prototypeMember, key);
				}
			}
		}
	}

})(Backbone);
