sinon.config.useFakeTimers = false;
QUnit.module("bindChange");
QUnit.test("binds change on property", function(assert) {
	let done = assert.async();
	let fixture = document.querySelector("#qunit-fixture");

	let bndr = Bndr.create({
		template: fixture,
		model: {
			value : "red"
		}
	})
	.bindChange("value", (newValue) => {
		assert.equal(newValue, "blue", "attached change");
		done();
	}).attach();

	let model = bndr.getBoundModel();
	model.value = "blue";
});
