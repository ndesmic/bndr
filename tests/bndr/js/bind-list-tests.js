sinon.config.useFakeTimers = false;

QUnit.module("bindElement");
QUnit.test("binds to element initially (text)", function(assert) {
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");

    let testModel = [
		{ message: "Peter Parker" },
		{ message: "Bruce Wayne" }
	];

    let bndr = Bndr.create({
        template: testElement,
        model: testModel
    });

    bndr.bindElement(".label", "message")
		.attachTo(fixture);

    let labels = fixture.querySelectorAll(".label");

    assert.equal(labels.length, 2, "templated multiple elements");
    assert.equal(labels[0].textContent, "Peter Parker", "templated textContent");
    assert.equal(labels[1].textContent, "Bruce Wayne", "templated textContent");
});
QUnit.test("binds to element initially (method ordering agnostic)", function(assert) {
    let done = assert.async();
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");

    let testModel = [{
        message: "Peter Parker"
    }];

    let { bndr, model } = Bndr.create()
                .setTemplate(testElement)
                .setModel(testModel)
                .bindElement(".label", "message")
                .attachTo(fixture)
                .getBndrAndModel();

    model.push({
        message : "Bruce Wayne"
    });

    setTimeout(x => {
        var labels = fixture.querySelectorAll(".label");
        assert.equal(labels.length, 2, "templated multiple elements");
        assert.equal(labels[0].textContent, "Peter Parker", "templated textContent");
        assert.equal(labels[1].textContent, "Bruce Wayne", "templated textContent");
        done();
    }, 0);
});
QUnit.test("binds updates element (text)", function(assert) {
    let done = assert.async();
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");

    let testModel = [
		{ message: "Peter Parker" },
		{ message: "Bruce Wayne" }
	];

    let bndr = Bndr.create({
        template: testElement,
        model: testModel
    });

    let model = bndr.bindElement(".label", "message").attachTo(fixture).getBoundModel();
    model[0].message = "Spider Man";
    model[1].message = "Batman";


    setTimeout(x => {
        var labels = fixture.querySelectorAll(".label");
        assert.equal(labels[0].textContent, "Spider Man", "templated textContent");
        assert.equal(labels[1].textContent, "Batman", "templated textContent");
        done();
    }, 0);
});

QUnit.module("model.push");
QUnit.test("creates new element on add", function(assert) {
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");

    let testModel = [
		{ message: "Peter Parker" },
		{ message: "Bruce Wayne"}
	];

    let bndr = Bndr.create({
        template: testElement,
        model: testModel
    });

    let model = bndr.bindElement(".label", "message").attachTo(fixture).getBoundModel();
    model.push({
        message: "Clark Kent"
    });

    let labels = fixture.querySelectorAll(".label");
    assert.equal(labels.length, 3, "templated multiple elements");
    assert.equal(labels[0].textContent, "Peter Parker", "templated textContent");
    assert.equal(labels[1].textContent, "Bruce Wayne", "templated textContent");
    assert.equal(labels[2].textContent, "Clark Kent", "templated textContent");
});
QUnit.test("can update new element", function(assert) {
    let done = assert.async();
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");

    var testModel = [{
        message: "Peter Parker"
    }, {
        message: "Bruce Wayne"
    }];

    let bndr = Bndr.create({
        template: testElement,
        model: testModel
    });

    let model = bndr.bindElement(".label", "message").attachTo(fixture).getBoundModel();
    model.push({
        message: "Clark Kent"
    });

    let labels = fixture.querySelectorAll(".label");
    assert.equal(labels.length, 3, "templated multiple elements");

    model[2].message = "Super Man";

    setTimeout(x => {
        labels = fixture.querySelectorAll(".label");
        assert.equal(labels[2].textContent, "Super Man", "templated textContent");
        done();
    }, 0);
});

QUnit.module("model.pop");
QUnit.test("removes elements", function(assert) {
    let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");

    let testModel = [
		{ message: "Peter Parker" },
		{ message: "Bruce Wayne" }
	];

    let { bndr, model } = Bndr
					.create()
					.setTemplate(testElement)
					.setModel(testModel)
					.bindElement(".label", "message")
					.attachTo(fixture)
					.getBndrAndModel();
    model.pop();

    let labels = fixture.querySelectorAll(".label");
    assert.equal(labels.length, 1, "templated multiple elements");
    assert.equal(labels[0].textContent, "Peter Parker", "templated textContent");
});

QUnit.module("Misc");
QUnit.test("Adds new child binding type when top-level binding type added", function(assert) {
	let { testElement, fixture } = TestUtil.makeFixture("<template id='test'><span class='label'></span></template>");

    let testModel = [
		{ message: "Peter Parker" },
		{ message: "Bruce Wayne" }
	];

    let { bndr, model } = Bndr
					.create()
					.setTemplate(testElement)
					.setModel(testModel)
					.attachTo(fixture)
					.getBndrAndModel();
	bndr.bindElement(".label", "message");

	let labels = fixture.querySelectorAll(".label");
    assert.equal(labels[0].textContent, "Peter Parker", "templated textContent");
	assert.equal(labels[1].textContent, "Bruce Wayne", "templated textContent");
});
