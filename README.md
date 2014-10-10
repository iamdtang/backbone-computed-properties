Backbone Computed Properties
============================

Ember-style computed properties for Backbone models. This is very much a work in progress. Pull requests are welcome!

### Install

Grab _backbone-computed.js_ from the _src_ directory and include it on your page.

```html
<script src="backbone-computed.js"></script>
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
