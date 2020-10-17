(function(){

	function attachDragEvent(element, model, binding, storage){
		attachNoDupe(element, model, binding, storage, "dragover", dragOver);
		attachNoDupe(element, model, binding, storage, "dragleave", dragLeave);
	}

	function attachNoDupe(element, model, binding, storage, eventName, handler){
		let bindingKey = getBindingKey(binding, eventName);
		let storedBinding = Bndr.getFromMapTree(storage, bindingKey);
		if(storedBinding === binding){
			return;
		}
		let boundHandler = handler.bind(null, model, binding);
		boundHandler.boundFrom = handler;
		element.addEventListener(eventName, boundHandler);
		Bndr.setToMapTree(storage, bindingKey, binding);
	}

	function getBindingKey(binding, eventName){
		return [binding.selector, binding.accessor, eventName].join("-");
	}

	function dragOver(model, binding, e){
		e.preventDefault();
		Bndr.setObjectProp(model, binding.accessor, true);
	}

	function dragLeave(model, binding, e){
		e.preventDefault();
		Bndr.setObjectProp(model, binding.accessor, false);
	}

	Bndr.register({
		api : {
			bindDrag : function(selector, accessor){
				return {
					selector : selector,
					accessor : accessor,
					type: "drag"
				}
			}
		},
		implementation : function({ elements, model, binding, storage } = {}){
			let selectedElements = Bndr.queryElementsInList(elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				attachDragEvent(x, model, binding, storage);
			});
		},
		type : "drag"
	});

})(Bndr);
