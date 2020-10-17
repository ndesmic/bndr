sinon.config.useFakeTimers = false;
QUnit.module("bindClass");
QUnit.test("binds to element initially", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: true
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindClass(".link", "value", "red").attachTo(fixture);
	var value = fixture.querySelector(".link").classList;

	assert.ok(value.contains("red"), "templated class");
});
QUnit.test("binds to element initially (false)", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: false
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindClass(".link", "value", "red").attachTo(fixture);
	var value = fixture.querySelector(".link").classList;

	assert.notOk(value.contains("red"), "templated class");
});
QUnit.test("bind updates element true->false", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: true
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindClass(".link", "value", "red").attachTo(fixture).getBoundModel();
	model.value = false;


	setTimeout(x => {
		var value = fixture.querySelector(".link").classList;
		assert.notOk(value.contains("red"));
		done();
	}, 0);
});
QUnit.test("bind updates element false->true", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: false
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindClass(".link", "value", "red").attachTo(fixture).getBoundModel();
	model.value = true;


	setTimeout(x => {
		var value = fixture.querySelector(".link").classList;
		assert.ok(value.contains("red"));
		done();
	}, 0);
});

/*======================================
*Bind Class Reversed
========================================*/
QUnit.module("bindClassReversed");
QUnit.test("binds to element initially", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: false
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindClassReversed(".link", "value", "red").attachTo(fixture);
	var value = fixture.querySelector(".link").classList;
	assert.ok(value.contains("red"), "templated class");
});
QUnit.test("bind updates element", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: true
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindClassReversed(".link", "value", "red").attachTo(fixture).getBoundModel();
	model.value = false;

	setTimeout(x => {
		var value = fixture.querySelector(".link").classList;
		assert.ok(value.contains("red"));
		done();
	}, 0);
});
