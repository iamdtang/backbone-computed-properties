(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], factory);
  } else if (typeof exports !== 'undefined') {
    return module.exports = factory(require('backbone'), require('underscore'));
  } else {
    factory(root.Backbone, root._);
  }
})(this, function(Backbone, _) {
  Backbone.Computed = Backbone.computed = function(args) {
    if (this instanceof Backbone.computed) {
      args = Array.prototype.slice.call(args, 0);
      this.computedFunction = args[args.length - 1];
      this.dep = args.slice(0, -1);
    } else {
      return new Backbone.computed(arguments);
    }
  };

  Backbone.computed.prototype.getDependentProperties = function() {
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
    var computeValue = function() {
      model.set(propertyName, property.computedFunction.call(model));
    };

    var dependentProperties = _.memoize(function() {
      return _.filter(property.getDependentProperties(), function(property) {
        return property.indexOf('event:') < 0;
      });
    });

    var dependentEvents = _.memoize(function() {
      return _.chain(property.getDependentProperties())
        .filter(function(property) {
          return property.indexOf('event:') === 0;
        })
        .map(function(property) {
          return property.replace('event:', '');
        })
        .value();
    });

    var propertiesEventsToListen = function() {
      return dependentProperties().map(function(propertyName) {
        return 'change:' + propertyName;
      });
    };

    var attachDependentPropertiesListeners = function() {
      var eventString;

      if (!dependentProperties().length) {
        return;
      }
      eventString = propertiesEventsToListen().join(' ');
      model.on(eventString, computeValue);
    };

    var attachDependentEventsListeners = function() {
      var eventString;

      if (!dependentEvents().length) {
        return;
      }
      eventString = dependentEvents().join(' ');
      model.on(eventString, computeValue);
    };

    attachDependentPropertiesListeners();
    attachDependentEventsListeners();
    computeValue();
  };

  function initializeComputedProperties() {
    var prototypeMember;
    var prototype = _.extend({}, Object.getPrototypeOf(this), this.constructor.__super__);

    for (var key in prototype) {
      if (prototype.hasOwnProperty(key)) {
        prototypeMember = prototype[key];

        if (prototypeMember instanceof Backbone.computed) {
          ComputedPropertySetup(this, prototypeMember, key);
        }
      }
    }
  }

  Backbone.computed.alias = function(propertyToAlias) {
    return Backbone.computed(propertyToAlias, function() {
      return this.get(propertyToAlias);
    });
  };

  Backbone.computed.equal = function(property, value) {
    return Backbone.computed(property, function() {
      return this.get(property) === value;
    });
  };

  return Backbone.computed;
});
