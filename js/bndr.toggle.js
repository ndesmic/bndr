(function(){

	function attachToggleEvent(element, model, binding, storage){
		let bindingKey = getBindingKey(binding);
		let storedBinding = Bndr.getFromMapTree(storage, bindingKey);
		if(storedBinding === binding){
			return;
		}
		let handler = toggle.bind(null, model, binding);
		handler.boundFrom = toggle;
		element.addEventListener(binding.eventName, handler);
		Bndr.setToMapTree(storage, bindingKey, binding);
	}

	function getBindingKey(binding){
		return [binding.selector, binding.accessor, binding.eventName, `(${binding.values.join("-")})`].join("-");
	}

	function toggle(model, binding){
		let value = Bndr.access(model, binding.accessor);
		let valueIndex = binding.values.indexOf(value);
		valueIndex++;
		if(valueIndex >= binding.values.length){
			valueIndex = 0;
		}
		let newValue = binding.values[valueIndex];
		Bndr.setObjectProp(model, binding.accessor, newValue);
	}

	Bndr.register({
		api : {
			bindToggle : function(selector, eventName, accessor, values = [true, false]){
				return {
					selector : selector,
					accessor : accessor,
					eventName : eventName,
					values : values,
					type : "toggle"
				};
			}
		},
		implementation : function({ elements, model, binding, storage, isInitial } = {}){
			let selectedElements = Bndr.queryElementsInList(elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				attachToggleEvent(x, model, binding, storage);
			});
		},
		type : "toggle"
	});

})(Bndr);
