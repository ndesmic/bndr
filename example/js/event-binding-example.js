document.addEventListener("DOMContentLoaded", () => {
  Bndr.create()
    .setModel({})
    .setTemplate(document.getElementById("button-tmpl"))
    .bindEvent(".button", "click", click)
	.bindEvent(".button", "click", click) //this will not attach because it's a duplicate
    .attachTo(document.body);

	Bndr.create()
	  .setModel([
		  { value : 1 }
	  ])
	  .setTemplate(document.querySelector(".square"))
	  .bindEvent(Bndr.rootElement, "click", click)
	  .attachTo(document.body);
});

function click(){
	let div = document.createElement("div");
	div.textContent = "clicked!";
	document.body.appendChild(div);
}
