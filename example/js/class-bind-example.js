document.addEventListener("DOMContentLoaded", () => {
  Bndr.create()
    .setModel({
      happy : true
    })
    .setTemplate(document.getElementById("test-item"))
    .bindClass(Bndr.rootElement, "happy", "happy")
    .attach();
});
