describe('Backbone.Computed', function() {
	var Person;
  var david;

  beforeEach(function() {
    Person = Backbone.Model.extend({
      fullName: new Backbone.Computed('first', 'last', function() {
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
});