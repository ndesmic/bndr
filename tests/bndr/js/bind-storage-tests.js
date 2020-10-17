sinon.config.useFakeTimers = false;
QUnit.module("bindStorage");

let db;
function setupStorage(){
	if(db){
		return;
	}
	db = new Promise((resolve, reject) => {
		let openRequest = indexedDB.open("bndr-storage", 1);
		openRequest.onerror = () => reject(openRequest.error);
		openRequest.onupgradeneeded = (e) => {
			if(!e.target.objectStoreNames || !e.target.objectStoreNames.contains("storage")){
				e.target.result.createObjectStore("storage");
			}
		};
		openRequest.onsuccess = () => resolve(openRequest.result);
	});
}
function get(namespace, accessor){
	return new Promise((resolve, reject) => {
		db.then(database => {
			let transaction = database.transaction("storage", "readonly");
			let store = transaction.objectStore("storage");
			let request = store.get(`${namespace}-${accessor}`);
			request.onerror = () => reject(request.error);
			request.onsuccess = (e) => {
				resolve(e.target.result);
			};
		});
	});
}
function save(namespace, accessor, value){
	return new Promise((resolve, reject) => {
		db.then(database => {
			let transaction = database.transaction("storage", "readwrite");
			let store = transaction.objectStore("storage");
			let request = store.put(value, `${namespace}-${accessor}`);
			request.onerror = () => reject(request.error);
			request.onsuccess = (e) => {
				resolve(e.target.result);
			}
		});
	});
}

setupStorage();

QUnit.test("binds to element initially", function(assert) {
	let done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: ""
	};

	var { bndr, model } = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindStorage("message", "unit-test")
	.attachTo(fixture)
	.getBndrAndModel();

	db.then(() => {
		save("unit-test", "message", "stored").then(() => {
			setTimeout(() => {
				assert.equal(model.message, "stored", "templated innerText");
				Bndr.clearStorage();
				done();
			},200);
		});
	});
});

QUnit.test("updates storage", function(assert) {
	let done = assert.async();
	var fixture = document.querySelector("#qunit-fixture");
	fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
	var testElement = document.querySelector("#test");
	var testModel = {
		message: ""
	};

	var { bndr, model } = Bndr.create({
		template: testElement,
		model: testModel
	})
	.bindStorage("message", "unit-test")
	.attachTo(fixture)
	.getBndrAndModel();

	db.then(() => {
		model.message = "a new message!";
		setTimeout(() => {
			assert.equal(model.message, "a new message!", "templated innerText");
			Bndr.clearStorage();
			done();
		},200);
	});
});
