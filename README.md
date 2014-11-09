Backbone Computed Properties
============================

[![Build Status](https://travis-ci.org/skaterdav85/backbone-computed-properties.svg?branch=master)](https://travis-ci.org/skaterdav85/backbone-computed-properties)

Ember-style computed properties for Backbone models. This is very much a work in progress. Pull requests are welcome!

### Why Computed Properties?

Computed properties let you declare functions as properties. It's super handy for taking one or more normal properties and transforming or manipulating their data to create a new value. 

For example, imagine you have a Product model with _price_ and _discountprice_ properties. In your template, you need to determine if _discountprice_ is less than _price_, and if so, show _price_ striked out and _discountprice_ beneath it. Having this conditional logic in a template can be messy, and impossible depending on the client-side templating library you are using. Instead, it would be useful to have a property called _hasDiscount_ that is automatically computed from _price_ and _discountprice_ and recomputes whenever those properties change. Then, the conditional logic in your template becomes much simpler and achievable even with the most minimal logicless templates.

### Install

Grab _backbone-computed.js_ from the _src_ directory and include it on your page.

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

### Example

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
