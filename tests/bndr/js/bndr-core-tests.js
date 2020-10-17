sinon.config.useFakeTimers = false;

QUnit.module("setModel");
QUnit.test("can late bind model", function(assert) {
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");
	let testModel = {
		message: "Peter Parker"
	};

	let bndr = Bndr.create({
		template: testElement
	});

	bndr.bindElement(".label", "message").attachTo(fixture);
	bndr.setModel(testModel);

	let value = fixture.querySelector(".label").textContent;

	assert.equal(value, "Peter Parker", "templated textContent");
});

QUnit.module("setTemplate");
QUnit.test("can late bind template", function(assert) {
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");
	let testModel = {
		message: "Peter Parker"
	};

	let bndr = Bndr.create({
		model: testModel
	});

	bndr.bindElement(".label", "message").attachTo(fixture);
	bndr.setTemplate(testElement);

	let value = fixture.querySelector(".label").textContent;

	assert.equal(value, "Peter Parker", "templated textContent");
});

QUnit.module("attachTo");

QUnit.module("attach");
QUnit.test("will template in place if existing node", function(assert) {
	let { testElement, fixture } = TestUtil.makeFixture("<div id='test'><span class='label'></span></div>");
	let testModel = {
		message: "Peter Parker"
	};

	let bndr = Bndr.create({
			model: testModel,
			template: testElement
		})
		.bindElement(".label", "message")
		.attach();

	let value = fixture.querySelector(".label").textContent;
	assert.equal(value, "Peter Parker", "templated textContent");
});

QUnit.module("misc");
QUnit.test("should allow upfront binds", function(assert) {
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><input class='input' /></template>");

	let { bndr, model } = Bndr.create({
		model : {},
		template : testElement,
		bindings : [{
			accessor : "message",
			initialBind : true,
			selector : ".input",
			type : "element",
			updatesModel : true,
			updatesView : false,
		}]
	})
	.attachTo(fixture)
	.getBndrAndModel();

	assert.equal(model.message, "");
});

QUnit.module("bindClassExclusive");
QUnit.module("bindHtml");
