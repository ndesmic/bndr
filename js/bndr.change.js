(function(){
	Bndr.register({
		api : {
			bindChange : function(accessor, handler){
				return {
					accessor : accessor,
					handler : handler,
					type : "change"
				}
			}
		},
		implementation : function({ model, binding, isInitial } = {}){
			if(isInitial){
				return;
			}
			let value = Bndr.access(model, binding.accessor);
			binding.handler(value, model);
		},
		type : "change"
	});

})(Bndr);
