sinon.config.useFakeTimers = false;
QUnit.module("bindEvent");
QUnit.test("binds event to element", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><button>Click Me!</button></template>";
	var testElement = document.querySelector("#test");

	var bndr = Bndr.create({
		template: testElement,
		model: {}
	})
	.bindEvent("button", "click", () => {
		assert.ok(true, "attached event");
		done();
	}).attachTo(fixture);

	TestUtil.fireEvent(fixture.querySelector("button"), "click");
});
