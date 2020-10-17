sinon.config.useFakeTimers = false;
QUnit.module("bindAttribute");
QUnit.test("binds to element initially", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		url: "https://www.google.com"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindAttribute(".link", "url", "href").attachTo(fixture);

	var value = fixture.querySelector(".link").href;

	assert.equal(value, "https://www.google.com/", "templated attribute");
});

QUnit.test("bind updates element", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		url: "https://www.google.com"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindAttribute(".link", "url", "href").attachTo(fixture).getBoundModel();
	model.url = "https://www.amazon.com";


	setTimeout(x => {
		var value = fixture.querySelector(".link").href;
		assert.equal(value, "https://www.amazon.com/", "templated attribute");
		done();
	}, 0);
});

QUnit.module("bindAttributeExistence");
QUnit.test("binds to element initially", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><button class='btn'></button></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		disabledValue: true
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindAttributeExistence(".btn", "disabledValue", "disabled").attachTo(fixture);

	var value = fixture.querySelector(".btn").disabled;

	assert.ok(value, "templated attribute");
});
QUnit.test("bind updates element", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><button class='btn'></button></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		disabledValue: false
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindAttributeExistence(".btn", "disabledValue", "disabled").attachTo(fixture).getBoundModel();
	model.disabledValue = true;


	setTimeout(x => {
		var value = fixture.querySelector(".btn").disabled;
		assert.ok(value, "templated attribute");
		done();
	}, 0);
});

QUnit.module("bindAttributeExistenceReversed");
QUnit.test("binds to element initially", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><button class='btn'></button></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		notDisabledValue: false
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindAttributeExistenceReversed(".btn", "notDisabledValue", "disabled").attachTo(fixture);

	var value = fixture.querySelector(".btn").disabled;
	assert.ok(value, "templated attribute");
});
QUnit.test("bind updates element", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><button class='btn'></button></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		notDisabledValue: true
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindAttributeExistenceReversed(".btn", "disabledValue", "disabled").attachTo(fixture).getBoundModel();
	model.notDisabledValue = false;

	setTimeout(x => {
		var value = fixture.querySelector(".btn").disabled;
		assert.ok(value, "templated attribute");
		done();
	}, 0);
});
