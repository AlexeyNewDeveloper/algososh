/* eslint-disable jest/valid-expect */
import { compareValues } from "../support/utils";

describe("Фибоначчи", () => {
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

    compareValues("11235");
  });
});
