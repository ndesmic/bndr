sinon.config.useFakeTimers = false;
QUnit.module("compute");
QUnit.test("should compute property initially", function(assert) {
	let done = assert.async();
	let fixture = document.querySelector("#qunit-fixture");

	let bndr = Bndr.create({
		template: fixture,
		model: {
			height : 4,
			width : 5,
			area : 0
		}
	})
	.computeValue(["height", "width"], (h, w) => h*w, "area")
	.attach();

	let model = bndr.getBoundModel();

	assert.equal(model.area, 20);
	done();
});
QUnit.test("should update computed property", function(assert) {
	let done = assert.async();
	let fixture = document.querySelector("#qunit-fixture");

	let bndr = Bndr.create({
		template: fixture,
		model: {
			height : 4,
			width : 5,
			area : 0
		}
	})
	.computeValue(["height", "width"], (h, w) => h*w, "area")
	.attach();

	let model = bndr.getBoundModel();
	model.height = 30;
	model.width = 30;

	setTimeout(x => {
		assert.equal(model.area, 900, "updated value");
		done();
	}, 0);
});
