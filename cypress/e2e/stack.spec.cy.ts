/* eslint-disable jest/valid-expect */

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import {
  compareValues,
  compareStyles,
  addValueToInput,
} from "../support/utils";

describe("Стек", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/stack");

    cy.get("input").as("input");
    cy.get("[data-testid='addButton']").as("addButton");
    cy.get("[data-testid='deleteButton']").as("deleteButton");
    cy.get("[data-testid='clearButton']").as("clearButton");
    cy.get("[data-testid='resultBox']").as("resultBox");
  });

  it("Кнопка добавления недоступна при пустом инпуте", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@addButton").should("be.disabled");
  });

  it("Корректное добавление элементов в Стек", () => {
    cy.clock();

    addValueToInput("s");

    compareValues("s");
    compareStyles("changing");

    cy.tick(SHORT_DELAY_IN_MS);

    compareStyles("default");

    addValueToInput("q");

    compareValues("sq");
    compareStyles("default,changing");

    cy.tick(SHORT_DELAY_IN_MS);

    compareValues("sq");
    compareStyles("default,default");
  });

  it("Корректное удаление элемента из Стека", () => {
    addValueToInput("q s");

    cy.clock();

    cy.get("@deleteButton").click();

    compareValues("qs");
    compareStyles("default,changing");

    cy.tick(SHORT_DELAY_IN_MS);

    compareValues("q");
    compareStyles("default");

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@deleteButton").click();

    compareValues("q");
    compareStyles("changing");

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@resultBox").should("be.empty");
  });

  it("Корректная очистка Стека", () => {
    addValueToInput("q s");

    cy.get("@clearButton").click();

    cy.get("@resultBox").should("be.empty");
  });
});
