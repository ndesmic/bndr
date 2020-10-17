sinon.config.useFakeTimers = false;
QUnit.module("bindToggle");
var tests = [
	true,
	false
];
tests.forEach(test => {
	QUnit.test(`binds toggle event (toggle ${test})`, function(assert) {
		var done = assert.async();
		var fixture = document.querySelector("#qunit-fixture");
		fixture.innerHTML = "<template id='test'><button>Click Me!</button></template>";
		var testElement = document.querySelector("#test");

		var bndr = Bndr.create({
			template: testElement,
			model: {
				value : test
			}
		})
		.bindToggle("button", "click", "value")
		.attachTo(fixture);
		var model = bndr.getBoundModel();

		TestUtil.fireEvent(fixture.querySelector("button"), "click");

		setTimeout(x => {
			assert.equal(model.value, !test, "updated value");
			done();
		}, 0);
	});
});
var tests = [
	["red", "green", "blue"],
	["green", "blue", "red"],
	["blue", "red", "green"]
];
tests.forEach(test => {
	QUnit.test(`binds toggle event (n-valued)`, function(assert) {
		var done = assert.async();
		var fixture = document.querySelector("#qunit-fixture");
		fixture.innerHTML = "<template id='test'><button>Click Me!</button></template>";
		var testElement = document.querySelector("#test");

		var bndr = Bndr.create({
			template: testElement,
			model: {
				value : test[0]
			}
		})
		.bindToggle("button", "click", "value", ["red", "green", "blue"])
		.attachTo(fixture);
		var model = bndr.getBoundModel();

		TestUtil.fireEvent(fixture.querySelector("button"), "click");

		TestUtil.wait()
			.then(x => assert.equal(model.value, test[1], "updated value"))
			.then(x => TestUtil.fireEvent(fixture.querySelector("button"), "click"))
			.then(TestUtil.wait)
			.then(x => assert.equal(model.value, test[2], "updated value again"))
			.then(done);
	});
});
QUnit.test(`binds to same element multiple times`, function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<button>Click Me!</button>";

	var bndr = Bndr.create({
		template: fixture,
		model: {
			value : "red",
			value2 : true
		}
	})
	.bindToggle("button", "click", "value", ["red", "blue"])
	.bindToggle("button", "click", "value2", [true, false])
	.attach();
	var model = bndr.getBoundModel();

	TestUtil.fireEvent(fixture.querySelector("button"), "click");

	TestUtil.wait()
		.then(x => {
			assert.equal(model.value, "blue", "updated value 1");
			assert.equal(model.value2, false, "updated value 2")
		})
		.then(done);
});
