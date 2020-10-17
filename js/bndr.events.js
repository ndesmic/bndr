(function(){

	function attachEvent(obj, eventName, handler, value, storage){
		let storedHandler = Bndr.getFromMapTree(storage, "events", obj, eventName);
		if(handler === storedHandler || handler.boundFrom === storedHandler){
			return;
		}
		obj.addEventListener(eventName, e => handler(e, value));
		Bndr.setToMapTree(storage, "events", obj, eventName, handler.boundFrom ? handler.boundFrom : handler);
	}

	Bndr.register({
		api : {
			bindEvent : function(selector, eventName, handler, accessor){
				if(typeof(handler) !== "function"){
					return console.warn(`Could not bind ${eventName} ${selector}, handler is not a function`);
				}
				return {
					eventName : eventName,
					selector : selector,
					handler : handler,
					accessor : accessor,
					type : "event"
				};
			}
		},
		implementation : function({ root, elements, model, binding, storage } = {}){
			let value = Bndr.access(model, binding.accessor);

			if(typeof(binding.selector) === "string"){
				let selectedElements = Bndr.getSelectedElements(root, elements, binding.selector);
				selectedElements.forEach(x => {
					attachEvent(x, binding.eventName, binding.handler, value, storage);
				});
			} else {
				if(!binding.selector.addEventListener){
					return console.error("Objects with bind event must support addEventListener.");
				}
				attachEvent(binding.selector, binding.eventName, binding.handler, value, storage);
			}
		},
		type : "event"
	});

})(Bndr);
