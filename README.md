Backbone Computed Properties
============================

### Install

Grab _backbone-computed.js_ from the _src_ directory and include it on your page.

```html
<script src="backbone-computed.js"></script>
```

### Example

```js
var Person = Backbone.Model.extend({
  fullName: new Backbone.Computed('first', 'last', function() {
    return this.get('first') + ' ' + this.get('last');
  })
});

var david = new Person({
  first: 'David',
  last: 'Tang'
});
```