describe("Доступность приложения", function () {
  it("Приложение запустилось по адресу localhost:3000", function () {
    cy.visit("http://localhost:3000");
  });
});
