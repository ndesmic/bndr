sinon.config.useFakeTimers = false;
QUnit.module("bindDrag");

QUnit.test(`change model to true if dragover`, function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = `<template id='test'><div class="drag"></div></template>`;
	var testElement = document.querySelector("#test");
	var bndr = Bndr.create({
		template: testElement,
		model: {
			value : false
		}
	})
	.bindDrag(".drag", "value")
	.attachTo(fixture);
	var model = bndr.getBoundModel();
	TestUtil.fireEvent(fixture.querySelector(".drag"), "dragover");
	setTimeout(x => {
		assert.equal(model.value, true, "updated value");
		done();
	}, 0);
});

QUnit.test(`change model to false if dragleave`, function(assert) {
	var done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = `<template id='test'><div class="drag"></div></template>`;
	var testElement = document.querySelector("#test");
	var bndr = Bndr.create({
		template: testElement,
		model: {
			value : true
		}
	})
	.bindDrag(".drag", "value")
	.attachTo(fixture);
	var model = bndr.getBoundModel();
	TestUtil.fireEvent(fixture.querySelector(".drag"), "dragleave");
	setTimeout(x => {
		assert.equal(model.value, false, "updated value");
		done();
	}, 0);
});
