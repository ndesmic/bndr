(function(){

	Bndr.register({
		api : {
			computeValue : function(accessor, handler, resultName){
				if(typeof(handler) !== "function"){
					return console.warn(`Could not bind compute ${JSON.stringify(accessor)}. Handler is not a function`);
				}
				return {
					accessor : accessor,
					handler : handler,
					resultName : resultName,
					type : "compute-value"
				};
			}
		},
		implementation : function({ model, binding } = {}){
			let values = [].concat(binding.accessor).map(x => Bndr.access(model, x));
			Bndr.setObjectProp(model, binding.resultName, binding.handler(...values));
		},
		type : "compute-value"
	});

})(Bndr);
