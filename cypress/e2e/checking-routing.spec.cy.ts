describe("Проверка роутинга", function () {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Стартовая страница", () => {
    cy.get("h1").contains("МБОУ АЛГОСОШ");
  });

  it("Тестирование перехода на страницу алгоритма Строки", () => {
    cy.get("a[href*='recursion']").click();
    cy.get("h3").contains("Строка");
    cy.get("p").contains("К оглавлению").click();
    cy.get("h1").contains("МБОУ АЛГОСОШ");
  });

  it("Тестирование перехода на страницу алгоритма Фибоначчи", () => {
    cy.get("a[href*='fibonacci']").click();
    cy.get("h3").contains("Последовательность Фибоначчи");
    cy.get("p").contains("К оглавлению").click();
    cy.get("h1").contains("МБОУ АЛГОСОШ");
  });

  it("Тестирование перехода на страницу алгоритма Сортировки", () => {
    cy.get("a[href*='sorting']").click();
    cy.get("h3").contains("Сортировка массива");
    cy.get("p").contains("К оглавлению").click();
    cy.get("h1").contains("МБОУ АЛГОСОШ");
  });

  it("Тестирование перехода на страницу алгоритма Стек", () => {
    cy.get("a[href*='stack']").click();
    cy.get("h3").contains("Стек");
    cy.get("p").contains("К оглавлению").click();
    cy.get("h1").contains("МБОУ АЛГОСОШ");
  });

  it("Тестирование перехода на страницу алгоритма Очередь", () => {
    cy.get("a[href*='queue']").click();
    cy.get("h3").contains("Очередь");
    cy.get("p").contains("К оглавлению").click();
    cy.get("h1").contains("МБОУ АЛГОСОШ");
  });

  it("Тестирование перехода на страницу алгоритма Лист", () => {
    cy.get("a[href*='list']").click();
    cy.get("h3").contains("Связный список");
    cy.get("p").contains("К оглавлению").click();
    cy.get("h1").contains("МБОУ АЛГОСОШ");
  });
});

// describe("Тестирование переходов по страницам", function () {
//   const getUrlFor = (adress: string) => {
//     return `http://localhost:3000/${adress}`;
//   };

//   it("Страница с разворачиванием строки", function () {
//     cy.visit(getUrlFor("recursion"));
//   });

//   it("Страница с последовательностью Фибоначчи", function () {
//     cy.visit(getUrlFor("fibonacci"));
//   });

//   it("Страница с сортировкой массива", function () {
//     cy.visit(getUrlFor("sorting"));
//   });

//   it("Страница со Стеком", function () {
//     cy.visit(getUrlFor("stack"));
//   });

//   it("Страница с Очередью", function () {
//     cy.visit(getUrlFor("queue"));
//   });

//   it("Страница со Связным списком", function () {
//     cy.visit(getUrlFor("list"));
//   });
// });
