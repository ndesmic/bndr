document.addEventListener("DOMContentLoaded", () => {
  Bndr.create()
    .setModel({
      firstName : "Peter",
      lastName : "Parker"
    })
    .setTemplate(document.getElementById("name-card"))
    .bindElement(".first-name", "firstName")
    .bindElement(".last-name", "lastName")
    .attach();
});
