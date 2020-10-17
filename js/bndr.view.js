(function(){

	function setView(element, model, view, options){
		view.create(Object.assign({}, {
			root : element,
			model : model,
		}, options));
	}

	Bndr.register({
		api : {
			bindView : function(selector, accessor, view, options){
				return {
					accessor,
					selector,
					view,
					options
				}
			}
		},
		implementation : function({ elements, model, binding, isInitial } = {}){
			if(!isInitial){
				return;
			}
			let selectedElements = Bndr.queryElementsInList(elements, binding.selector);
			let value = Bndr.access(model, binding.accessor);
			[].concat(selectedElements).forEach(x => {
				setView(x, value, binding.view, binding.options);
			});
		},
		type : "view"
	});

})(Bndr);
