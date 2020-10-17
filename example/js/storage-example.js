document.addEventListener("DOMContentLoaded", () => {
  Bndr.create()
    .setModel({
		name : ""
	})
    .setTemplate(document.body)
	.bindStorage("name", "storage-test")
    .bindElementTwoWay("#name", "name", false)
	.bindEvent("#clear", "click", () => Bndr.clearStorage())
    .attach();
});
