sinon.config.useFakeTimers = false;
QUnit.module("bindStyle");
QUnit.test("binds to element initially", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		color: "blue"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindStyle(".label", "color", "color").attachTo(fixture);

	var value = fixture.querySelector(".label").style.color;

	assert.equal(value, "blue", "templated style");
});
QUnit.test("binds updates element", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		color: "blue"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindStyle(".label", "color", "color").attachTo(fixture).getBoundModel();
	model.color = "red";


	setTimeout(x => {
		var value = fixture.querySelector(".label").style.color;
		assert.equal(value, "red", "templated style");
		done();
	}, 0);
});
