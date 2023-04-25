/* eslint-disable jest/valid-expect */

describe("Тестирование алгоритма разворота строки", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/fibonacci");
  });

  it("Кнопка добавления недоступна при пустом инпуте", () => {
    cy.get("input").should("have.value", "");
    cy.get("button").should("be.disabled");
  });

  it("Корректное генерирование чисел", () => {
    cy.get("input").type("4");
    cy.get("button").contains("Рассчитать").click();

    cy.get("[data-testid='circle_letter']").should((elements) => {
      const arrayFromValues = Array.from(elements, (element) => {
        return element.textContent;
      });
      expect(arrayFromValues).eql(["1", "1", "2", "3", "5"]);
    });
  });
});
