/* eslint-disable jest/valid-expect */

import { DELAY_IN_MS } from "../../src/constants/delays";

describe("Тестирование алгоритма разворота строки", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/recursion");
  });

  it("Кнопка добавления недоступна при пустом инпуте", () => {
    cy.get("input").should("have.value", "");
    cy.get("button").should("be.disabled");
  });

  it("Корректный разворот строки", () => {
    const compareValues = (expectedString: string): void => {
      const arrayOfValue = expectedString.split("");

      cy.get("[data-testid='circle_letter']").should((elements) => {
        const arrayFromValues = Array.from(elements, (element) => {
          return element.textContent;
        });
        expect(arrayFromValues).eql(arrayOfValue);
      });
    };

    const compareStyles = (expectedStyles: string): void => {
      const arrayFromStyles = expectedStyles.split(",");
      cy.get("[data-testid='circle_color_state']").should((elements) => {
        const arrayFromValuesOfClassname = Array.from(elements, (element) => {
          return element.classList.value;
        });

        arrayFromValuesOfClassname.forEach((classname, index) => {
          expect(classname).to.match(RegExp(arrayFromStyles[index]));
        });
      });
    };

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
