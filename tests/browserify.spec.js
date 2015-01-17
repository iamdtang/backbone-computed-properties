var Backbone = require('backbone');
var Computed = require('./../src/backbone-computed');

describe('Backbone.Computed', function() {
	it('should be browserifiable', function() {
		expect(Backbone.Computed).to.equal(Computed);
	});

	describe('exports should work as Backbone.Computed', function() {
		var Person;
		var david;
		
		beforeEach(function() {
	    Person = Backbone.Model.extend({
	      fullName: Computed('first', 'last', function() {
	        return this.get('first') + ' ' + this.get('last');
	      })
	    });

	    david = new Person({
	      first: 'David',
	      last: 'Tang'
	    });
	  });

	  it('should compute when the object is constructed', function() {
	    expect(david.get('fullName')).to.equal('David Tang');
	  });
  });
});