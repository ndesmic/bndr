document.addEventListener("DOMContentLoaded", () => {
  Bndr.create()
    .setModel({
		message : "",
		on : false,
		choice : "green"
    })
    .setTemplate(document.getElementById("input-tmpl"))
    .bindElementTwoWay(".input", "message")
	.bindElementTwoWay(".checkbox", "on")
	.bindElementTwoWay(".select", "choice")
	.bindElement(".output-input", "message")
	.bindElement(".output-checkbox", "on")
	.bindElement(".output-select", "choice")
    .attachTo(document.body);
});
