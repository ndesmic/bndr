sinon.config.useFakeTimers = false;
QUnit.module("bindElement");
QUnit.test("binds to element initially (text)", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: "Peter Parker"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindElement(".label", "message").attachTo(fixture);
	var value = fixture.querySelector(".label").textContent;
	assert.equal(value, "Peter Parker", "templated textContent");
});
QUnit.test("binds updates element (text)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: "Peter Parker"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindElement(".label", "message").attachTo(fixture).getBoundModel();
	model.message = "Spider Man";


	setTimeout(x => {
		var value = fixture.querySelector(".label").textContent;
		assert.equal(value, "Spider Man", "templated textContent");
		done();
	}, 0);
});
QUnit.test("binds to element initially (input)", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><input /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: "Peter Parker"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindElement("input", "message").attachTo(fixture);

	var value = fixture.querySelector("input").value;

	assert.equal(value, "Peter Parker", "templated value");
});
QUnit.test("bind updates element (input)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><input /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: "Peter Parker"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindElement("input", "message").attachTo(fixture).getBoundModel();
	model.message = "Spider Man";


	setTimeout(x => {
		var value = fixture.querySelector("input").value;
		assert.equal(value, "Spider Man", "templated value");
		done();
	}, 0);
});
QUnit.test("binds to element initially (textarea)", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><textarea /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: "Peter Parker"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElement("textarea", "message")
	.attachTo(fixture);

	var value = fixture.querySelector("textarea").value;
	assert.equal(value, "Peter Parker", "templated value");
});
QUnit.test("bind updates element (textarea)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><textarea /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: "Peter Parker"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElement("textarea", "message")
	.attachTo(fixture);

	let model = bndr.getBoundModel();

	model.message = "Spider Man";

	TestUtil.wait().then(x => {
		var value = fixture.querySelector("textarea").value;
		assert.equal(value, "Spider Man", "templated value");
		done();
	});
});
QUnit.test("binds to element initially (checkbox)", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><input type='checkbox' /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: true
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindElement("input", "value").attachTo(fixture);

	var value = fixture.querySelector("input").checked;

	assert.equal(value, true, "templated checkbox");
});
QUnit.test("bind updates element (checkbox)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><input type='checkbox' /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: false
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindElement("input", "value").attachTo(fixture).getBoundModel();
	model.value = "Spider Man";


	setTimeout(x => {
		var value = fixture.querySelector("input").checked;
		assert.equal(value, true, "templated checkbox");
		done();
	}, 0);
});



QUnit.test("binds to element initially (radio)", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = `<template id='test'>
							<input type='radio' name='val' value="first" />
							<input type='radio' name='val' value="second" />
							<input type='radio' name='val' value="third" />
						</template>`;
	var testElement = document.querySelector("#test");
	var testModel = {
		value: "second"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindElement("input", "value").attachTo(fixture);

	let radios = fixture.querySelectorAll("input:checked");
	let value = radios[0].value;

	assert.equal(radios.length, 1, "correct length");
	assert.equal(value, "second", "templated radio");
});
QUnit.test("bind updates element (radio)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML =  `<template id='test'>
							<input type='radio' name='val' value="first" />
							<input type='radio' name='val' value="second" />
							<input type='radio' name='val' value="third" />
						</template>`;
	var testElement = document.querySelector("#test");
	var testModel = {
		value: "second"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindElement("input", "value").attachTo(fixture).getBoundModel();
	model.value = "third";


	setTimeout(x => {
		let radios = fixture.querySelectorAll("input:checked");
		let value = radios[0].value;
		assert.equal(radios.length, 1, "correct length");
		assert.equal(value, "third", "templated checkbox");
		done();
	}, 0);
});

QUnit.test("binds to element initially (select)", function(assert) {
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><select><option value='A'>A</option><option value='B'>B</option><option value='C'>C</option></select></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: "B"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	bndr.bindElement("select", "value").attachTo(fixture);

	var value = fixture.querySelector("select").value;

	assert.equal(value, "B", "templated select");
});
QUnit.test("bind updates element (select)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><select><option value='A'>A</option><option value='B'>B</option><option value='C'>C</option></select></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		value: "B"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	});

	var model = bndr.bindElement("select", "value").attachTo(fixture).getBoundModel();
	model.value = "C";


	setTimeout(x => {
		var value = fixture.querySelector("select").value;
		assert.equal(value, "C", "templated select");
		done();
	}, 0);
});

QUnit.module("bindElementReverse");
var tests = [
	[ "text", "lorem", "ipsum"],
	[ "password",  "p@ssw0rd", "p@ssw0rd2" ],
	[ "url", "http://www.bndr.com", "http://www.bndr2.com"],
	[ "email", "bndr@bndr.com", "bndr2@bndr.com" ],
	[ "tel", "555-555-5555", "555-555-5556"],
	[ "date", "2016-07-01", "2016-07-02"]
];
tests.forEach(([type, value, newValue] = []) => {
	QUnit.test(`reverse bind updates model (${type})`, function(assert) {
		let done = assert.async();
		let fixture = document.querySelector("#qunit-fixture");
		fixture.innerHTML = `<template id='test'><input type='${type}' /></template>`;
		let testElement = document.querySelector("#test");
		let testModel = {
			message: value
		};

		let bndr = Bndr.create({
			template: testElement,
			model: testModel
		})
		.bindElementReverse("input", "message")
		.attachTo(fixture)
		.getBoundModel();

		TestUtil.wait().then(x => {
			let input = fixture.querySelector("input");
			input.value = newValue;
			TestUtil.fireEvent(input, "input")
			assert.equal(testModel.message, newValue, "set model value");
			done();
		});
	});
});
QUnit.test(`reverse bind updates model (radio)`, function(assert) {
	let done = assert.async();
	let fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = `<template id='test'>
							<input type='radio' name='val' value="red" />
							<input type='radio' name='val' value="blue" />
							<input type='radio' name='val' value="green" />
						</template>`;
	let testElement = document.querySelector("#test");
	let testModel = {
		message: "red"
	};

	let bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementReverse("input", "message")
	.attachTo(fixture)
	.getBoundModel();

	TestUtil.wait().then(x => {
		let inputBlue = fixture.querySelector("input[value='blue']");
		inputBlue.checked = true;
		TestUtil.fireEvent(inputBlue, "change")
		assert.equal(testModel.message, "blue", "set model value");
		done();
	});
});
var tests = [
	[ "text", "lorem", "ipsum", "lorem ipsum"],
	[ "password",  "p@ssw0rd", "p@ssw0rd2", "p@ssword2"],
	[ "url", "http://www.bndr.com", "http://www.bndr2.com", "http://www.bndr2.com"],
	[ "email", "bndr@bndr.com", "bndr2@bndr.com", "bndr3@bndr.com"],
	[ "tel", "555-555-5555", "555-555-5556", "555-555-5557"],
	[ "date", "2016-07-01", "2016-07-02", "2016-07-03"]
];
tests.forEach(([type, oldValue, setValue, changeValue] = []) => {
	QUnit.test(`does not update view (${type})`, assert => {
		let done = assert.async();
		let fixture = document.querySelector("#qunit-fixture");
		fixture.innerHTML = `<template id='test'><input type="${type}" value='${oldValue}' /></template>`;
		let testElement = document.querySelector("#test");
		let testModel = {
			message: setValue
		};

		let bndr = Bndr.create({
			template: testElement,
			model: testModel
		})
		.bindElementReverse("input", "message")
		.attachTo(fixture)
		.getBoundModel();

		bndr.message = changeValue;

		TestUtil.wait().then(x => {
			assert.equal(fixture.querySelector("input").value, oldValue, "did not set model value");
			done();
		});
	});
});
QUnit.test(`does not update view (radio)`, assert => {
	let done = assert.async();
	let fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = `<template id='test'>
							<input type='radio' name='val' value="red" />
							<input type='radio' name='val' value="blue" />
							<input type='radio' name='val' value="green" />
						</template>`;
	let testElement = document.querySelector("#test");
	let testModel = {
		message: "red"
	};

	let bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementReverse("input", "message")
	.attachTo(fixture)
	.getBoundModel();

	bndr.message = "blue";

	TestUtil.wait().then(x => {
		let checkedRadios = fixture.querySelectorAll("input:checked");
		assert.equal(checkedRadios.length, 0, "did not set others");
		done();
	});
});
QUnit.test("binds initially if no value (input)", assert => {
	let fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><input value='Wolverine' /></template>";
	let testElement = document.querySelector("#test");
	let testModel = {
		message: null
	};

	let bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementReverse("input", "message")
	.attachTo(fixture)
	.getBoundModel();

	assert.equal(testModel.message, "Wolverine", "picked up inital value");
});

QUnit.module("bindElementTwoWay");
QUnit.test("two-way bind updates model (textarea)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><textarea /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: "Peter Parker"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementTwoWay("textarea", "message")
	.attachTo(fixture)
	.getBoundModel();

	TestUtil.wait().then(x => {
		let input = fixture.querySelector("textarea");
		input.value = "Wolverine";
		TestUtil.fireEvent(input, "input")
		assert.equal(testModel.message, "Wolverine", "set model value");
		done();
	});
});
QUnit.test("two-way bind updates model (checkbox)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><input type='checkbox' /></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		on : false
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementTwoWay("input", "on")
	.attachTo(fixture)
	.getBoundModel();

	TestUtil.wait().then(x => {
		let input = fixture.querySelector("input");
		input.checked = true;
		TestUtil.fireEvent(input, "change")
		assert.ok(testModel.on, "set model value");
		done();
	});
});

QUnit.test(`reverse bind updates model (radio)`, function(assert) {
	let done = assert.async();
	let fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = `<template id='test'>
							<input type='radio' name='val' value="red" />
							<input type='radio' name='val' value="blue" />
							<input type='radio' name='val' value="green" />
						</template>`;
	let testElement = document.querySelector("#test");
	let testModel = {
		message: "red"
	};

	let bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementTwoWay("input", "message")
	.attachTo(fixture)
	.getBoundModel();

	TestUtil.wait().then(x => {
		let inputBlue = fixture.querySelector("input[value='blue']");
		inputBlue.checked = true;
		TestUtil.fireEvent(inputBlue, "change")
		assert.equal(testModel.message, "blue", "set model value");
		done();
	});
});

QUnit.test("two-way bind updates model (select)", function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML =
		`<template id='test'>
			<select>
				<option value="a">A</option>
				<option value="b">B</option>
				<option value="c">C</option>
			</select>
		</template>`;
	var testElement = document.querySelector("#test");
	var testModel = {
		choice : "a"
	};

	var bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementTwoWay("select", "choice")
	.attachTo(fixture)
	.getBoundModel();

	TestUtil.wait().then(x => {
		let select = fixture.querySelector("select");
		select.value = "c";
		TestUtil.fireEvent(select, "change")
		assert.equal(testModel.choice, "c", "set model value");
		done();
	});
});
var tests = [
	[ "text", "lorem", "ipsum"],
	[ "password",  "p@ssw0rd", "p@ssw0rd2" ],
	[ "url", "http://www.bndr.com", "http://www.bndr2.com"],
	[ "email", "bndr@bndr.com", "bndr2@bndr.com" ],
	[ "tel", "555-555-5555", "555-555-5556"],
	[ "date", "2016-07-01", "2016-07-02"]
];
tests.forEach(([type, value, newValue] = []) => {
	QUnit.test(`two-way bind updates model (${type})`, function(assert) {
		let done = assert.async();
		let fixture = document.querySelector("#qunit-fixture");
		fixture.innerHTML = `<template id='test'><input type='${type}' /></template>`;
		let testElement = document.querySelector("#test");
		let testModel = {
			message: value
		};

		let bndr = Bndr.create({
			template: testElement,
			model: testModel
		})
		.bindElementTwoWay("input", "message")
		.attachTo(fixture)
		.getBoundModel();

		TestUtil.wait().then(x => {
			let input = fixture.querySelector("input");
			input.value = newValue;
			TestUtil.fireEvent(input, "input")
			assert.equal(testModel.message, newValue, "set model value");
			done();
		});
	});
});
QUnit.test("binds initially if no value (input)", assert => {
	let fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><input value='Wolverine' /></template>";
	let testElement = document.querySelector("#test");
	let testModel = {
		message: null
	};

	let bndr = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindElementTwoWay("input", "message")
	.attachTo(fixture)
	.getBoundModel();

	assert.equal(testModel.message, "Wolverine", "picked up inital value");
});
