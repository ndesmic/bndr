(function(){

	function setStyle(element, style, value){
		element.style[style] = value;
	}

	Bndr.register({
		api : {
			bindStyle : function(selector, accessor, style){
				return {
					accessor : accessor,
					selector : selector,
					style : style,
					type : "style"
				}
			}
		},
		implementation : function({ elements, model, binding, storage } = {}){
			let selectedElements = Bndr.queryElementsInList(elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				setStyle(x, binding.style, value);
			});
		},
		type : "style"
	});

})(Bndr);
