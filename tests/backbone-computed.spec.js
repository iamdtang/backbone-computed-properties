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
    expect(david.get('fullName')).to.equal('David Tang');
  });

  it('should update when the dependent properties change', function() {
    david.set({ last: 'Doe' });
    expect(david.get('fullName')).to.equal('David Doe');
    david.set({ first: 'David', last: 'Tang' });
    expect(david.get('fullName')).to.equal('David Tang');
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

    expect(david.get('username')).to.equal('davidtang');
    david.set({ last: 'Doe' });
    expect(david.get('username')).to.equal('daviddoe');
  });

  it('should not set up any listeners if there are no dependent properties', function() {
    var spy = sinon.spy(Backbone.Model.prototype, 'on');

    Person = Backbone.Model.extend({
      createdAt: Backbone.Computed(function() {
        return new Date();
      })
    });

    david = new Person({
      first: 'David',
      last: 'Tang'
    });

    expect(spy.callCount).to.equal(0);
  });

  it('should allow computed properties to depend on a model event', function() {
    Person = Backbone.Model.extend({
      syncCount: Backbone.Computed('event:sync', function() {
       if (_.isUndefined(this.get('syncCount'))) {
         return 0;
       } else {
         return this.get('syncCount') + 1;
       };
      })
    });

    david = new Person();
    expect(david.get('syncCount')).to.equal(0);
    david.trigger('sync');
    expect(david.get('syncCount')).to.equal(1);
  });
});
