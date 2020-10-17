const View = (function(){

	const defaults = {
		root : null, //required
		model : null //required
	};

	function create(options){
		let view = {};
		view.options = Object.assign({}, defaults, options);
		bind(view);
		view.init();
		return view;
	}

	function bind(view){
		view.init = init.bind(view);
		view.cacheDom = cacheDom.bind(view);
		view.attachEvents = attachEvents.bind(view);
	}

	function cacheDom(){
		this.dom = {};
		this.dom.root = this.options.root;
		this.dom.button = this.dom.root.querySelector(".button");
	}

	function attachEvents(){
		this.dom.button.addEventListener("click", () => {
			alert(JSON.stringify(this.options.model));
		});
	}

	function init(){
		this.cacheDom();
		this.attachEvents();
	}

	return {
		create
	};

})();

document.addEventListener("DOMContentLoaded", () => {
  Bndr.create()
    .setTemplate(document.getElementById("view-tmpl"))
    .setModel([
		{ value : "A" },
		{ value : "B" },
		{ value : "C" }
	])
    .bindView(".view-item", "value", View)
    .attachTo(document.body);
});
