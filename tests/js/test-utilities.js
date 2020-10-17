var TestUtil = (function(){
	function fireEvent(element,eventName){
		let event = new Event(eventName);
		element.dispatchEvent(event);
	}

	function wait(time){
		return new Promise((resolve, reject) => {
			setTimeout(resolve,time || 0);
		});
	}

	function makeFixture(html){
		let fixture = document.querySelector("#qunit-fixture");
		fixture.innerHTML = html;
		return { testElement : document.querySelector("#test"), fixture : fixture };
	}

	return {
		fireEvent : fireEvent,
		wait : wait,
		makeFixture: makeFixture
	};
})();
