(function(){

	function setClass(element, klass, value, reversed){
	  if(!reversed && !!value || (reversed && !value)){
		  element.classList.add(klass);
	  }else{
		element.classList.remove(klass);
	  }
	}

	Bndr.register({
		api : {
			bindClass : function(selector, accessor, klass){
				return {
					accessor : accessor,
					selector : selector,
					klass : klass,
					type : "class",
					reversed : false
				};
			},
			bindClassReversed : function(selector, accessor, klass){
				return {
					accessor : accessor,
					selector : selector,
					klass : klass,
					type : "class",
					reversed : true
				};
			}
		},
		implementation : function({ root, elements, model, binding, storage } = {}){
			let selectedElements = Bndr.getSelectedElements(root, elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				setClass(x, binding.klass, value, binding.reversed);
			});
		},
		type : "class"
	});

})(Bndr);
