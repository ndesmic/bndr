const BndrBuildView = (function() {
	const modules = [
		"core",
		"dom",
		"class",
		"attributes",
		"style",
		"events",
		"change",
		"compute",
		"toggle",
		"drag",
		"storage",
		"view"
	];

	function create() {
		const bndrBuildView = {};
		bind(bndrBuildView);
		bndrBuildView.init();
		return bndrBuildView;
	}

	function bind(bndrBuildView) {
		bndrBuildView.init = init.bind(bndrBuildView);
		bndrBuildView.setBndr = setBndr.bind(bndrBuildView);
		bndrBuildView.copy = copy.bind(bndrBuildView);
		bndrBuildView.download = download.bind(bndrBuildView);
		bndrBuildView.compileSource = compileSource.bind(bndrBuildView);
	}

	function setBndr() {
		let model = modules.reduce((s,x) => s[x] = true, {});
		model = Object.assign({}, model, {
			files: {},
			source: "",
			checks: modules.map(x => { return { name: x, enabled: true }})
		});

		this.bndr = Bndr.create()
			.setTemplate(document.body)
			.setModel(model)
			.bindEvent("#copy", "click", this.copy)
			.bindEvent("#download", "click", this.download)
			.bindEvent(Dispatcher.globalDispatcher, "checks-change", this.compileSource)
			.bindElement("#output", "source")
			.bindView("#types-checklist", "checks", ChecklistView, {
				template : document.querySelector("#checkbox-tmpl")
			})
			.attach();

		modules.forEach(x => this.bndr.bindElementReverse(`#${x}`, x));

		this.model = this.bndr.getBoundModel();
	}

	function init() {
		this.setBndr();
		let urls = ["js/bndr.js"].concat(modules.map(x => `js/bndr.${x}.js`));

		fetchScripts(modules)
			.then(files => {
				this.model.files = files;
				this.compileSource(modules);
			});
	}

	function compileSource(enabledSources){
		let sources = "";
		let files = this.model && this.model.files ? this.model.files : {};
		for(let i = 0; i < enabledSources.length; i++){
			sources += files[enabledSources[i]];
		}
		this.model.source = sources;
	}

	function fetchScripts(modules) {
		let files = {};
		let promises = [];
		for (let i = 0; i < modules.length; i++) {
			let request = fetch(`js/bndr.${modules[i]}.js`).then(x => x.text()).then(x => files[modules[i]] = x);
			promises.push(request);
		}
		return Promise.all(promises).then(() => files);
	}

	function copy() {
		Util.copy(document.querySelector("#output"));
	}

	function download() {
		let dataUri = Util.stringToDataUri(this.model.source);
		Util.download(dataUri, "bndr.js");
	}

	return {
		create
	};
})();
