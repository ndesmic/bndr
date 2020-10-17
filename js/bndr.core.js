const Bndr = (function(){

	const modelRootAccessor = Symbol("model root accessor");
	const rootElement = Symbol("root element query accessor");
	const bindingTypes = {};
	const defaults = {
		template : null,
		bindings : null,
		model : null
	};

	function create(options){
		var bndr = {};
		bndr.options = Object.assign({}, defaults, options);
		bind(bndr);
		bndr.init();
		return bndr;
	}

	function bind(bndr){
		bndr.init = init.bind(bndr);
		bndr.bindApi = bindApi.bind(bndr);
		bndr.bindApiMethod = bindApiMethod.bind(bndr);
		bndr.attach = attach.bind(bndr);
		bndr.attachTo = attachTo.bind(bndr);
		bndr.remove = remove.bind(bndr);
		bndr.updateBinding = updateBinding.bind(bndr);
		bndr.setTemplate = setTemplate.bind(bndr);
		bndr.setModel = setModel.bind(bndr);
		bndr.onPropertySet = onPropertySet.bind(bndr);
		bndr.triggerUpdate = triggerUpdate.bind(bndr);
		bndr.getBoundModel = getBoundModel.bind(bndr);
		bndr.getBndrAndModel = getBndrAndModel.bind(bndr);
		bndr.query = query.bind(bndr);
		bndr.setListModel = setListModel.bind(bndr);
		bndr.setListTemplate = setListTemplate.bind(bndr);
		bndr.attachListTo = attachListTo.bind(bndr);
		bndr.onPush = onPush.bind(bndr);
		bndr.onPop = onPop.bind(bndr);
		bndr.pushArrayElement = pushArrayElement.bind(bndr);
		bndr.popArrayElement = popArrayElement.bind(bndr);
	}

	function init(){
		this.model = {
			bindings : this.options.bindings || [],
			extensions : new Map(),
			attachment : null,
			bndrs : []
		};

		this.bindApi();
		this.setTemplate(this.options.template);
		this.setModel(this.options.model || {});
	}

	function bindApi(){
		for(let key in bindingTypes){
			for(let methodName in bindingTypes[key].api){
				this.bindApiMethod(bindingTypes[key], methodName, bindingTypes[key].api[methodName])
			};
		}
	}

	function bindApiMethod(bindingType, methodName, method){
		this[methodName] = (...args) => {
			let bindingAttrs = method(...args);
			bindingAttrs.type = bindingType.type;
			this.model.bindings.push(bindingAttrs);
			this.model.bndrs.forEach(x => {
				x.model.bindings.push(bindingAttrs);
				x.updateBinding(x.model.bindings);
			});
			return this;
		};
	}

	function register(binding){
		bindingTypes[binding.type] = {
			api : binding.api,
			type : binding.type,
			implementation : binding.implementation
		};
	}

	function attachTo(element){
		this.model.attachment = element;
		if(Array.isArray(this.model.model)){
			this.attachListTo(element);
		}else{
			this.updateBinding(this.model.bindings, true);
			if(this.model.domRoot){
				element.appendChild(this.model.domRoot);
			}
		}
		return this;
	}

	function attach(){
		if(this.model.domRoot instanceof DocumentFragment){
			return console.error("Can only direct attach if template is a non-template node");
		}
		if(!Array.isArray(this.model.model)){
			this.updateBinding(this.model.bindings, true);
		}
		this.model.attachment = this.model.domRoot.parentNode;
		return this;
	}

	function attachListTo(element){
		this.model.bndrs.forEach(x => x.attachTo(element));
	}

	function remove(){
		this.model.elements.forEach(x => x.parentNode.removeChild(x));
	}

	function updateBinding(bindings, isInitial = false){
		if(!this.model.model || !this.model.template){
			return;
		}
		[].concat(bindings).forEach(binding => {
			let bindingType = bindingTypes[binding.type];
			if(!bindingType){
				throw `Could not find implementation for binding of type ${binding.type}`
			}
			if(!this.model.extensions[binding.type]){
				this.model.extensions[binding.type] = new Map();
			}
			bindingType.implementation({
				root : this.model.domRoot,
				elements : this.model.elements,
				model : this.model.model,
				binding : binding,
				storage : this.model.extensions[binding.type],
				isInitial : isInitial
			});
		});
	}

	function setTemplate(template){
		if(Array.isArray(this.model.model)){
			this.setListTemplate(template);
		}else{
			this.model.template = template;
			this.model.domRoot = getTemplate(template);
			this.model.elements = getDocfragChildList(this.model.domRoot);
			this.updateBinding(this.model.bindings);
		}

		if(this.model.attachment){
			this.attachTo(this.model.attachment);
		}

		return this;
	}

	function setListTemplate(template){
		this.model.bndrs.forEach(x => x.setTemplate(template));
	}

	function setModel(model){
		if(Array.isArray(model)){
			this.model.model = this.setListModel(model);
		}else if (model !== undefined && model !== null && typeof(model) == "object"){
			this.model.model = new Proxy(model, {
				set : this.onPropertySet
			});
		}else {
			throw "Cannot use value type, null or undefined as a model";
		}
		this.updateBinding(this.model.bindings);

		return this;
	}

	function setListModel(listModel){
		listModel.forEach(x => {
			this.model.bndrs.push(create({
				model : x,
				template : this.model.template,
				bindings : this.model.bindings.map(x => x)
			}));
		});
		listProxy = this.model.bndrs.map(x => x.getBoundModel());
		listProxy.push = new Proxy(listProxy.push, {
			apply : this.onPush
		});
		listProxy.pop = new Proxy(listProxy.pop, {
			apply : this.onPop
		});
		return listProxy;
		}

	function getBoundModel(){
		return this.model.model;
	}

	function getBndrAndModel(){
		return { bndr : this, model : this.getBoundModel() };
	}

	function query(selector){
		return queryElementsInList(this.elements, selector);
	}

	function onPropertySet(model, propertyName, newValue){
		if(model[propertyName] !== newValue){
			if(Array.isArray(model) && isNumber(propertyName) && propertyName < model.length){ //array element
				newValue = this.model.bndrs[propertyName].setModel(value).getBoundModel(); //possible bug value = newValue?
			}
			Reflect.set(model, propertyName, newValue);
			this.triggerUpdate(propertyName);
		}
		return true;
	}

	function onPush(target, thisArgument, argumentList){
		var model = this.pushArrayElement(argumentList[0]);
		Reflect.apply(target, thisArgument, [model]);
	}

	function onPop(target, thisArgument, argumentList){
		var model = this.popArrayElement(argumentList[0]);
		Reflect.apply(target, thisArgument, [model]);
	}

	function pushArrayElement(value){
		var bndr = create({
			model : value,
			template : this.model.template,
			bindings : this.model.bindings
		});
		this.model.bndrs.push(bndr);
		model = bndr.getBoundModel();
		if(this.model.attachment){
			bndr.attachTo(this.model.attachment);
		}
		return model;
	}

	function popArrayElement(){
		var model = this.model.bndrs.pop();
		model.remove();
	}

	function triggerUpdate(propertyName){
		var bindings = this.model.bindings.filter(x => propertyMatch(x.accessor, propertyName));
		this.updateBinding(bindings);
	}

	function propertyMatch(accessor, propertyName){
		if(!accessor){
			return false;
		}
		if(Array.isArray(accessor)){
			var propNames = accessor.map(getTopLevelProperty);
			return propNames.includes(propertyName);
		}
		return propertyName === getTopLevelProperty(accessor);
	}

	//Static Methods
	function getTemplate(templateElement){
		if(!templateElement){
			return null;
		}
		if(templateElement.tagName == "TEMPLATE"){
			return document.importNode(templateElement.content, true);
		}
		return templateElement;
	}

	function getDocfragChildList(docfrag){
		if(!docfrag){
			return [];
		}
		var list = [];
		for(var i = 0; i < docfrag.children.length; i++){
			list.push(docfrag.children[i]);
		}
		return list;
	}

	function isNumber(value) {
		return !isNaN(value-0) && value !== null && value !== "" && value !== false;
	}

	function getTopLevelProperty(accessor){
		if(accessor.includes(".")){
			return accessor.split(".")[0];
		}
		return accessor;
	}

	function access(obj, accessor){
		if(!obj || !accessor){
			return null;
		}

		if(accessor === modelRootAccessor){ //asymmetric with set but useful for some read ops
			return obj;
		}

		let keys = accessor.split(".");
		let prop = obj;
		for(let i = 0; i < keys.length; i++){
			if(keys[i] !== undefined && keys[i] !== ""){
				if(prop !== null && prop[keys[i]] !== undefined){
					prop = prop[keys[i]];
				}else{
					return null;
				}
			}
		}
		return prop;
	}

	function setObjectProp(obj, accessor, value){
		let keys = accessor.split(".");
		let prop = obj;
		for(let i = 0; i < keys.length-1; i++){
			if(keys[i] !== undefined){
				if(prop[keys[i]] !== undefined){
					prop = prop[keys[i]];
				}else{
					console.error("Could not find property:", obj, accessor);
				}
			}
		}
		if(prop.hasOwnProperty(keys[keys.length-1]) !== undefined){
			prop[keys[keys.length-1]] = value;
		}else{
			console.error("Could not find property:", obj, accessor);
		}
	}

	function getFromMapTree(map, ...accessors){
		let value = map;
		for(var i = 0; i < accessors.length; i++){
			if(value.has(accessors[i])){
				value = value.get(accessors[i]);
			}else{
				return null;
			}
		}
		return value;
	}

	function setToMapTree(map, ...accessors){
    	for(var i = 0; i < accessors.length - 1; i++){
    		if(i === accessors.length - 2){
    			map.set(accessors[i], accessors[i + 1]);
			}
			if(map.has(accessors[i])){
				map = map.get(accessors[i]);
	    	}else{
	    		let newMap = new Map();
	    		map.set(accessors[i], newMap);
	    		map = newMap;
	    	}
		}
	}

	function queryElementsInList(elements, selector){
		var matchingElements = [];

		if(!elements){
			return [];
		}

		for(var i = 0; i < elements.length; i++){
			var foundElements = elements[i].parentNode.querySelectorAll(selector); //need parent because this can include self
			if(foundElements.length > 0){
				for(var j = 0; j < foundElements.length; j++){
					if(isAncestorOrSelf(elements[i], foundElements[j])){ //check that we didn't find on some unrelated branch off parent
						matchingElements.push(foundElements[j]);
					}
				}
			}
		}
		return matchingElements;
	}

	function isAncestorOrSelf(thisNode, nodeToTest){
		while(thisNode != nodeToTest){
			if(nodeToTest.parentNode){
				nodeToTest = nodeToTest.parentNode;
			}else{
				return false;
			}
		}
		return true;
	}

	function getSelectedElements(root, activeElements, selector){
		if(selector === rootElement){
			return root;
		}
		return queryElementsInList(activeElements, selector);
	}

	return {
		create: create,
		register : register,
		access : access,
		setObjectProp : setObjectProp,
		getFromMapTree : getFromMapTree,
		setToMapTree : setToMapTree,
		queryElementsInList : queryElementsInList,
		getSelectedElements : getSelectedElements,
		modelRootAccessor : modelRootAccessor,
		rootElement : rootElement
	};

})();
