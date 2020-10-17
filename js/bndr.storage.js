(function(){
	let db;

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

	Bndr.clearStorage = function(){
		return new Promise((resolve, reject) => {
			db.then(database => {
				let transaction = database.transaction("storage", "readwrite");
				let store = transaction.objectStore("storage");
				let request = store.clear();
				request.onerror = () => reject(request.error);
				request.onsuccess = (e) => resolve(e.target.result);
			});
		});
	}

	function setupStorage(){
		if(db){
			return;
		}
		db = new Promise((resolve, reject) => {
			let openRequest = indexedDB.open("bndr-storage", 1);
			openRequest.onerror = () => reject(openRequest.error);
			openRequest.onupgradeneeded = (e) => {
				if(!e.target.objectStoreNames.contains("storage")){
					e.target.result.createObjectStore("storage");
				}
			};
			openRequest.onsuccess = () => resolve(openRequest.result);
		});
	}

	Bndr.register({
		api : {
			bindStorage : function(accessor, namespace){
				setupStorage();
				return {
					accessor : accessor,
					namespace : namespace,
					type : "storage"
				}
			}
		},
		implementation : function({ model, binding, isInitial } = {}){
			if(isInitial){
				get(binding.namespace, binding.accessor).then(value => {
					if(value !== undefined){
						Bndr.setObjectProp(model, binding.accessor, value);
					}
				});
			}else{
				let value = Bndr.access(model, binding.accessor);
				save(binding.namespace, binding.accessor, value)
					.catch(error => console.error(error));
			}
		},
		type : "storage"
	});

})(Bndr);
