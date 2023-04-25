/* eslint-disable jest/valid-expect */

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import {
  compareValues,
  compareStyles,
  compareHeadOrTail,
} from "../support/utils";

describe("Очередь", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/queue");

    cy.get("input").as("input");
    cy.get("[data-testid='addButton']").as("addButton");
    cy.get("[data-testid='deleteButton']").as("deleteButton");
    cy.get("[data-testid='clearButton']").as("clearButton");
  });

  //   const createQueue = (size: number) => {
  //     return ()=>{

  //     }

  //     Array.from({ length: size }, () => {
  //       return "";
  //     });
  //   };

  it("Кнопка добавления недоступна при пустом инпуте", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@addButton").should("be.disabled");
  });

  it("Корректное добавление элементов в Очередь", () => {
    cy.clock();

    cy.get("@input").type("s");
    cy.get("@addButton").click();

    cy.get("[data-testid='testing_circle']").as("circles");
    cy.get("[data-testid='circleHead']").as("circleHead");
    cy.get("[data-testid='circleTail']").as("circleTail");

    compareValues("", ["s", "", "", "", "", "", ""]);
    compareStyles("changing");
    cy.get("@circles").get("@circleHead").contains("head");
    cy.get("@circles").get("@circleTail").contains("tail");

    cy.tick(SHORT_DELAY_IN_MS);

    compareStyles("default");

    cy.get("@input").type("q");
    cy.get("@addButton").click();

    compareValues("", ["s", "q", "", "", "", "", ""]);
    compareStyles("default,changing");
    compareHeadOrTail(0, "head");
    compareHeadOrTail(1, "tail");

    cy.tick(SHORT_DELAY_IN_MS);

    compareStyles("default,default");

    cy.get("@input").type("e");
    cy.get("@addButton").click();

    compareValues("", ["s", "q", "e", "", "", "", ""]);
    compareStyles("default,default,changing");
    compareHeadOrTail(0, "head");
    compareHeadOrTail(2, "tail");

    cy.tick(SHORT_DELAY_IN_MS);
  });

  it("Корректное удаление элемента из Очереди", () => {
    cy.get("@input").type("s");
    cy.get("@addButton").click();
    cy.get("@input").type("q");
    cy.get("@addButton").click();
    cy.get("@input").type("e");
    cy.get("@addButton").click();

    cy.get("[data-testid='resultBox']").as("resultBox");

    cy.clock();

    cy.get("@deleteButton").click();

    compareValues("", ["s", "q", "e", "", "", "", ""]);
    compareStyles("changing,default,default");
    compareHeadOrTail(0, "head");
    compareHeadOrTail(2, "tail");

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@deleteButton").click();

    compareValues("", ["", "q", "e", "", "", "", ""]);
    compareStyles("default,changing,default");
    compareHeadOrTail(1, "head");
    compareHeadOrTail(2, "tail");

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@deleteButton").click();

    compareValues("", ["", "", "e", "", "", "", ""]);
    compareStyles("default,default,changing");
    compareHeadOrTail(2, "head");
    compareHeadOrTail(2, "tail");

    cy.tick(SHORT_DELAY_IN_MS);

    compareValues("", ["", "", "", "", "", "", ""]);
    compareStyles("default,default,default");
    compareHeadOrTail(3, "head");
    compareHeadOrTail(-1, "tail");

    cy.tick(SHORT_DELAY_IN_MS);

    compareValues("", ["", "", "", "", "", "", ""]);
  });

  it("Корректная очистка Очереди", () => {
    cy.get("@input").type("q");
    cy.get("@addButton").click();
    cy.get("@input").type("s");
    cy.get("@addButton").click();

    cy.get("@clearButton").click();

    compareValues("", ["", "", "", "", "", "", ""]);
  });
});
