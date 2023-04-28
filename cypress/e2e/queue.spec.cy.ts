/* eslint-disable jest/valid-expect */

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import {
  compareValues,
  compareStyles,
  compareHeadOrTail,
  addValueToInput,
  createTestQueue,
} from "../support/utils";

describe("Очередь", () => {
  let testQueue = createTestQueue(7);

  beforeEach(() => {
    cy.visit("http://localhost:3000/queue");

    cy.get("input").as("input");
    cy.get("[data-testid='addButton']").as("addButton");
    cy.get("[data-testid='deleteButton']").as("deleteButton");
    cy.get("[data-testid='clearButton']").as("clearButton");
  });

  it("Кнопка добавления недоступна при пустом инпуте", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@addButton").should("be.disabled");
  });

  it("Корректное добавление элементов в Очередь", () => {
    cy.clock();

    addValueToInput("s");

    cy.get("[data-testid='testingCircle']").as("circles");
    cy.get("[data-testid='circleHead']").as("circleHead");
    cy.get("[data-testid='circleTail']").as("circleTail");

    testQueue.a("s", 0);

    compareValues("", testQueue.getResult());
    compareStyles("changing");
    cy.get("@circles").get("@circleHead").contains("head");
    cy.get("@circles").get("@circleTail").contains("tail");

    testQueue.clear();

    cy.tick(SHORT_DELAY_IN_MS);

    compareStyles("default");

    addValueToInput("q");

    testQueue.a("s", 0);
    testQueue.a("q", 1);

    compareValues("", testQueue.getResult());
    compareStyles("default,changing");
    compareHeadOrTail(0, "head");
    compareHeadOrTail(1, "tail");

    testQueue.clear();

    cy.tick(SHORT_DELAY_IN_MS);

    compareStyles("default,default");

    addValueToInput("e");

    testQueue.a("s", 0);
    testQueue.a("q", 1);
    testQueue.a("e", 2);

    compareValues("", testQueue.getResult());
    compareStyles("default,default,changing");
    compareHeadOrTail(0, "head");
    compareHeadOrTail(2, "tail");

    testQueue.clear();

    cy.tick(SHORT_DELAY_IN_MS);
  });

  it("Корректное удаление элемента из Очереди", () => {
    addValueToInput("s q e");

    testQueue.a("s", 0);
    testQueue.a("q", 1);
    testQueue.a("e", 2);

    cy.get("[data-testid='resultBox']").as("resultBox");

    cy.clock();

    cy.get("@deleteButton").click();

    compareValues("", testQueue.getResult());
    compareStyles("changing,default,default");
    compareHeadOrTail(0, "head");
    compareHeadOrTail(2, "tail");

    testQueue.clear();

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@deleteButton").click();

    testQueue.a("q", 1);
    testQueue.a("e", 2);

    compareValues("", testQueue.getResult());
    compareStyles("default,changing,default");
    compareHeadOrTail(1, "head");
    compareHeadOrTail(2, "tail");

    testQueue.clear();

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@deleteButton").click();

    testQueue.a("e", 2);

    compareValues("", testQueue.getResult());
    compareStyles("default,default,changing");
    compareHeadOrTail(2, "head");
    compareHeadOrTail(2, "tail");

    testQueue.clear();

    cy.tick(SHORT_DELAY_IN_MS);

    compareValues("", testQueue.getResult());
    compareStyles("default,default,default");
    compareHeadOrTail(3, "head");
    compareHeadOrTail(-1, "tail");

    cy.tick(SHORT_DELAY_IN_MS);

    compareValues("", testQueue.getResult());
  });

  it("Корректная очистка Очереди", () => {
    addValueToInput("q s");

    cy.get("@clearButton").click();

    compareValues("", testQueue.getResult());
  });
});
