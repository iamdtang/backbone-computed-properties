Backbone Computed Properties
============================

[![Build Status](https://travis-ci.org/skaterdav85/backbone-computed-properties.svg?branch=master)](https://travis-ci.org/skaterdav85/backbone-computed-properties)

Ember-style computed properties for Backbone models. This is very much a work in progress. Pull requests are welcome!

### Why Computed Properties?

Computed properties let you declare functions as properties. It's super handy for taking one or more normal properties and transforming or manipulating their data to create a new value. 

You can achieve computed properties now in Backbone with observers in your model's _initialize()_ method, but if you have too many, it can get quite messy.

```js
Backbone.Model.extend({
	initialize: function() {
  		this.computeHasDiscount();
		this.on('change:price change:discountprice', this.computeHasDiscount, this);

		// could have more here ...
	},
		
	computeHasDiscount: function() { /* implementation */ }
});
```
In this example, I have only set up 1 computed property using the base Backbone features, but what if I have more than 1? Our initialize method can get really long and quite messy. So instead of using this approach, I decided to create a computed property library for Backbone with an API like that of Ember's computed properties.

### Install

Grab _backbone-computed.min.js_ from the _dist_ directory and include it on your page.

```html
<script src="backbone-computed.js"></script>
```

Or install through Bower

```
bower install backbone-computed-properties
```

Or install through NPM

```
npm install backbone-computed-properties
```

### Basic Example

```js
var Person = Backbone.Model.extend({
  fullName: Backbone.Computed('first', 'last', function() {
    return this.get('first') + ' ' + this.get('last');
  })
});

var david = new Person({
  first: 'David',
  last: 'Tang'
});

david.toJSON(); // { first: 'David', last: 'Tang', fullName: 'David Tang' }
david.get('fullName'); // David Tang
david.set({ last: 'Doe' });
david.get('fullName'); // David Doe
david.set({ first: 'David', last: 'Tang' });
david.get('fullName'); // David Tang
```

### Chaining Computed Properties

You can use computed properties as values to create new computed properties. Let's add a _username_ computed property to the previous example, and use the existing _fullName_ computed property:

```js
var Person = Backbone.Model.extend({
  fullName: Backbone.Computed('first', 'last', function() {
    return this.get('first') + ' ' + this.get('last');
  }),

  username: Backbone.Computed('fullName', function() {
    return this.get('fullName').replace(/\s/g, '').toLowerCase();
  })
});

var david = new Person({
  first: 'David',
  last: 'Tang'
});

david.get('username'); // davidtang
david.set({ last: 'Doe' });
david.get('username')); // daviddoe
```

### Unit Tests

Install karma and bower.

```
bower install
npm install
karma start
```
