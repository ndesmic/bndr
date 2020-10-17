document.addEventListener("DOMContentLoaded", () => {
  Bndr.create()
    .setModel({
		drag : false
	})
    .setTemplate(document.body)
    .bindDrag("#target", "drag")
	.bindClass("#target", "drag", "over")
    .attach();
});
