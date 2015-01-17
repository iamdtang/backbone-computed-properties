describe('playing around', function() {
	var ViewModel;
	var User;
	var user;

	beforeEach(function() {
		ViewModel = Backbone.Model.extend({
			constructor: function(options) {
				Object.keys(options).forEach(function(key) {
					var vm = this;

					if (options[key] instanceof Backbone.Model) {
						options[key].on('change', function() {
							vm.trigger('change');
							vm.trigger('change:' + key);
						});
					}
				}, this);

				return Backbone.Model.apply(this, arguments);
			},

			toJSON: function() {
				var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

				Object.keys(json).forEach(function(key) {
					var value = this.get(key);

					if (value instanceof Backbone.Model) {
						json[key] = value.toJSON();
					}
				}, this);

				return json;
			}
		});

		User = Backbone.Model.extend({

		});

		user = new User({
			first: 'David',
			email: 'dtang85@gmail.com'
		});
	});

	it('should call toJSON() on sub-models', function() {
		var vm = new ViewModel({
			user: user
		});

		expect(vm.toJSON()).to.eql({ user: { first: 'David', email: 'dtang85@gmail.com' } });
		vm.set('editEmail', true);
		expect(vm.toJSON()).to.eql({ user: { first: 'David', email: 'dtang85@gmail.com' }, editEmail: true });
	});

	it('should trigger a change on the view model when a sub-model changes', function() {
		var vm = new ViewModel({
			user: user
		});

		var spy = sinon.spy();

		vm.on('change', spy);
		vm.get('user').set('last', 'Tang');
		expect(spy.callCount).to.equal(1);
	});

	it('should trigger a change:property on the view model when a sub-model changes', function() {
		var vm = new ViewModel({
			user: user
		});

		var spy = sinon.spy();

		vm.on('change:user', spy);
		vm.get('user').set('last', 'Tang');
		expect(spy.callCount).to.equal(1);
	});
});