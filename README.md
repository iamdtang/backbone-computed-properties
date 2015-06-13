Backbone Computed Properties
============================

[![Build Status](https://travis-ci.org/skaterdav85/backbone-computed-properties.svg?branch=master)](https://travis-ci.org/skaterdav85/backbone-computed-properties)

Ember-style computed properties for Backbone models. This is very much a work in progress. Pull requests are welcome!

### Install

Grab _backbone-computed.min.js_ from the _dist_ directory and include it on your page.

```html
<script src="backbone-computed.min.js"></script>
```

Or install through Bower

```
bower install backbone-computed-properties
```

Or install through NPM

```
npm install backbone-computed-properties
```

You can also use this with Browserify.

```
var Computed = require('backbone-computed-properties');
```

Once you do that, you can either use `Computed` or `Backbone.Computed`.

### Why Computed Properties?

Computed properties let you declare functions as properties. It's super handy for taking one or more normal properties and transforming or manipulating their data to create a new value.

You can achieve computed properties now in Backbone with observers in your model's _initialize()_ method.

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
In the example above, I have only set up 1 computed property using the base Backbone features. If I had more than 1, the initialize method could get really long and quite messy. Instead of using this approach, I decided to create a computed property library for Backbone with an API like that of Ember's computed properties.

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

You can also set up computed properties that rely on model events using the prefix **event:**.  For example:

```js
Person = Backbone.Model.extend({
  syncCount: Backbone.Computed('event:sync', function() {
    return this.get('syncCount') + 1;
  })
});
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

Unit tests are written using Mocha, Chai, and Sinon. Install karma and bower and then start karma.

```
npm install -g bower
npm install -g karma
npm install -g browserify

bower install
npm install
karma start
```

### Build

The build process will create a minified version and place it in the _dist_ directory.

```
gulp
```
