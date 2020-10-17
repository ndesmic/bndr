(function(){

	const inputEventMap = {
		"TEXT" : "input",
		"CHECKBOX" : "change",
		"RADIO" : "change",
		"TEXTAREA" : "input",
		"SELECT" : "change",
		"PASSWORD" : "input",
		"URL" : "input",
		"EMAIL" : "input",
		"TEL" : "input",
		"DATE" : "input"
	};

	const inputValueMap = {
		"TEXT" : "value",
		"CHECKBOX" : "checked",
		"TEXTAREA" : "value",
		"SELECT" : "value",
		"PASSWORD" : "value",
		"URL" : "value",
		"EMAIL" : "value",
		"TEL" : "value",
		"DATE" : "value",
		"*" : "textContent"
	};

	function setElement(element, value){
		let inputType = getInputType(element);
		if(inputType === "RADIO"){
			element.checked = element.value === value;
		}else{
			element[getInputElementMappedValue(element, inputValueMap)] = value;
		}
	}

	function attachUpdateEvent(element, model, accessor, storage){
		let eventName = getInputElementMappedValue(element, inputEventMap);
		let handler = setModel.bind(this, element, model, accessor);
		handler.boundFrom = setModel; //gives us a handle to the original for equality testing
		attachEvent(element, eventName, handler, storage);
	}

	function setModel(element, model, accessor){
		let inputType = getInputType(element);
		let value;
		if(inputType === "RADIO"){
			if(element.checked){
				value = element.value;
			}else{
				return;
			}
		}else{
			value = element[getInputElementMappedValue(element, inputValueMap)];
		}
		Bndr.setObjectProp(model, accessor, value);
	}

	function getInputType(element){
		let elementType = element.tagName.toUpperCase();
		if(elementType === "INPUT"){
			return element.type.toUpperCase();
		}
		return elementType;
	}

	function getInputElementMappedValue(element, map){
		let inputType = getInputType(element);
		let result = map[inputType];
		if(!result){
			result = map["*"];
		}
		return result;
	}

	function attachEvent(element, eventName, handler, storage){
		let storedHandler = Bndr.getFromMapTree(storage, "events", element, eventName);
		if(handler === storedHandler || handler.boundFrom === storedHandler){
			return;
		}
		element.addEventListener(eventName, handler);
		Bndr.setToMapTree(storage, "events", element, eventName, handler.boundFrom ? handler.boundFrom : handler);
	}

	Bndr.register({
		api : {
			bindElement : function(selector, accessor){
				return {
					accessor : accessor,
					selector : selector,
					updatesView : true,
					updatesModel : false
				}
			},
			bindElementReverse : function(selector, accessor, initialBind = true){
				return {
					accessor : accessor,
					selector : selector,
					updatesView : false,
					updatesModel : true,
					initialBind : initialBind
				}
			},
			bindElementTwoWay : function(selector, accessor, initialBind = true){
				return {
					accessor : accessor,
					selector : selector,
					updatesView : true,
					updatesModel : true,
					initialBind : initialBind
				}
			}
		},
		implementation : function({ elements, model, binding, storage } = {}){
			let selectedElements = Bndr.queryElementsInList(elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				if(binding.updatesModel){
					attachUpdateEvent(x, model, binding.accessor, storage);
					if(!value && binding.initialBind){
						setModel(x, model, binding.accessor)
					}
				}
				if(binding.updatesView){
					setElement(x, value);
				}
			});
		},
		type : "element"
	});

})(Bndr);
