describe('Backbone.Computed', function() {
	var Person;
  var david;

  beforeEach(function() {
    Person = Backbone.Model.extend({
      fullName: Backbone.Computed('first', 'last', function() {
        return this.get('first') + ' ' + this.get('last');
      })
    });

    david = new Person({
      first: 'David',
      last: 'Tang'
    });
  });

  it('should compute when the object is constructed', function() {
    expect(david.get('fullName')).toEqual('David Tang');
  });

  it('should update when the dependent properties change', function() {
    david.set({ last: 'Doe' });
    expect(david.get('fullName')).toEqual('David Doe');
    david.set({ first: 'David', last: 'Tang' });
    expect(david.get('fullName')).toEqual('David Tang');
  });

  it('should allow computed properties to depend on other computed properties', function() {
    Person = Backbone.Model.extend({
      fullName: Backbone.Computed('first', 'last', function() {
        return this.get('first') + ' ' + this.get('last');
      }),

      username: Backbone.Computed('fullName', function() {
        return this.get('fullName').replace(/\s/g, '').toLowerCase();
      })
    });

    david = new Person({
      first: 'David',
      last: 'Tang'
    });

    expect(david.get('username')).toEqual('davidtang');
    david.set({ last: 'Doe' });
    expect(david.get('username')).toEqual('daviddoe');
  });
});