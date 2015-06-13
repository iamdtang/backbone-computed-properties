describe('Backbone.computed', function() {
	var Person;
  var david;

  beforeEach(function() {
    Person = Backbone.Model.extend({
      fullName: Backbone.computed('first', 'last', function() {
        return this.get('first') + ' ' + this.get('last');
      })
    });

    david = new Person({
      first: 'David',
      last: 'Tang'
    });
  });

	describe("Backbone.computed", function() {
	  it("should alias to Backbone.Computed for backwards compatibility", function() {
	    expect(Backbone.computed).to.equal(Backbone.Computed);
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

  it('should fire a change event when the computed property changes', function() {
    var spy = sinon.spy();
    david.on('change:fullName', spy);
    david.set({ last: 'Doe' });
    expect(spy.callCount).to.equal(1);
  });

  it('should allow computed properties to depend on other computed properties', function() {
    Person = Backbone.Model.extend({
      fullName: Backbone.computed('first', 'last', function() {
        return this.get('first') + ' ' + this.get('last');
      }),

      username: Backbone.computed('fullName', function() {
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

  it('should works on extend models', function() {
    ExtendPerson = Person.extend();

    david = new ExtendPerson({
      first: 'David',
      last: 'Tang'
    });

    expect(david.get('fullName')).to.equal('David Tang');
    david.set({ last: 'Doe' });
    expect(david.get('fullName')).to.equal('David Doe');
  });

  it('should not set up any listeners if there are no dependent properties', function() {
    var spy = sinon.spy(Backbone.Model.prototype, 'on');

    Person = Backbone.Model.extend({
      createdAt: Backbone.computed(function() {
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
      syncCount: Backbone.computed('event:sync', function() {
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

	describe("computed alias macro", function() {
		it("should create an alias", function() {
		  var Person = Backbone.Model.extend({
				age: Backbone.computed.alias('theage')
			});

			var person = new Person({
				theage: 66
			});

			expect(person.get('age')).to.equal(66);
		});
	});

	describe("computed equal macro", function() {
		var Person;

		beforeEach(function() {
			Person = Backbone.Model.extend({
				napTime: Backbone.computed.equal('state', 'sleepy')
			});
		});

		it("should be true if the property is equal to the value", function() {
			var person = new Person({
				state: 'sleepy'
			});

			expect(person.get('napTime')).to.equal(true);
		});

		it("should be false if the property is not equal to the value", function() {
			var person = new Person({
				state: 'hungry'
			});

			expect(person.get('napTime')).to.equal(false);
		});
	});
});
