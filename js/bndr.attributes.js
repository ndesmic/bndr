(function(){

	function setAttribute(element, attribute, value){
		element.setAttribute(attribute, value);
	}

	function setAttributeExistence(element, attribute, value, reversed){
		if((!reversed && !!value) || (reversed && !value)){
    		element.setAttribute(attribute, "");
    	}else{
    		element.removeAttribute(attribute);
    	}
	}

	Bndr.register({
		api : {
			bindAttribute : function(selector, accessor, attribute){
				return {
					accessor : accessor,
					selector : selector,
					attribute : attribute,
					type : "attribute"
				}
			}
		},
		implementation : function({ elements, model, binding, storage } = {}){
			let selectedElements = Bndr.queryElementsInList(elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				setAttribute(x, binding.attribute, value);
			});
		},
		type : "attribute"
	});

	Bndr.register({
		api : {
			bindAttributeExistence : function(selector, accessor, attribute){
				return {
					accessor : accessor,
					selector : selector,
					attribute : attribute,
					type : "attribute-existence",
					reversed : false
				}
			},
			bindAttributeExistenceReversed : function(selector, accessor, attribute){
				return {
					accessor : accessor,
					selector : selector,
					attribute : attribute,
					type : "attribute-existence",
					reversed : true
				}
			}
		},
		implementation : function({ elements, model, binding, storage } = {}){
			let selectedElements = Bndr.queryElementsInList(elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				setAttributeExistence(x, binding.attribute, value, binding.reversed);
			});
		},
		type : "attribute-existence"
	});

})(Bndr);
