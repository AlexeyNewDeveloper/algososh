/* eslint-disable jest/valid-expect */

import { DELAY_IN_MS } from "../../src/constants/delays";
import { compareValues, compareStyles } from "../support/utils";

describe("Тестирование алгоритма разворота строки", () => {
  beforeEach(() => {
    cy.visit("/recursion");
  });

  it("Кнопка добавления недоступна при пустом инпуте", () => {
    cy.get("input").should("have.value", "");
    cy.get("button").should("be.disabled");
  });

  it("Корректный разворот строки", () => {
    cy.clock();
    cy.get("input").type("вода");
    cy.get("button").contains("Развернуть").click();

    compareValues("вода");
    compareStyles("changing,default,default,changing");

    cy.tick(DELAY_IN_MS);
    cy.tick(DELAY_IN_MS);

    compareValues("аодв");
    compareStyles("changing,default,default,changing");

    cy.tick(DELAY_IN_MS);

    compareValues("аодв");
    compareStyles("modified,changing,changing,modified");

    cy.tick(DELAY_IN_MS);

    compareValues("адов");
    compareStyles("modified,changing,changing,modified");

    cy.tick(DELAY_IN_MS);

    compareValues("адов");
    compareStyles("modified,modified,modified,modified");
  });
});
