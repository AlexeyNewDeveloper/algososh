/* eslint-disable jest/valid-expect */

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

describe("Очередь", () => {
  beforeEach(() => {
    cy.visit("/list");

    cy.get("[data-testid='inputValue']").as("inputValue");
    cy.get("[data-testid='inputIndex']").as("inputIndex");
    cy.get("[data-testid='addToHead']").as("addToHead");
    cy.get("[data-testid='addToTail']").as("addToTail");
    cy.get("[data-testid='deleteFromHead']").as("deleteFromHead");
    cy.get("[data-testid='deleteFromTail']").as("deleteFromTail");
    cy.get("[data-testid='addToIndex']").as("addToIndex");
    cy.get("[data-testid='deleteFromIndex']").as("deleteFromIndex");
    cy.get("[data-testid='circleLetter']").as("circleLetters");
    cy.get("[data-testid='circleColorState']").as("circleColorState");
    cy.get("[data-testid='circleHead']").as("circleHead");
    cy.get("[data-testid='circleTail']").as("circleTail");
    cy.get("[data-testid='testingCircle']").as("testingCircle");
  });

  it("Кнопка добавления недоступна при пустом инпуте", () => {
    cy.get("@inputValue").should("have.value", "");
    cy.get("@addToHead").should("be.disabled");
    cy.get("@addToTail").should("be.disabled");
    cy.get("@addToIndex").should("be.disabled");
    cy.get("@deleteFromIndex").should("be.disabled");
  });

  it("Корректная отрисовка дефолтного списка", () => {
    cy.get("@circleLetters").each((circle) => {
      expect(circle.text().length).greaterThan(0);
    });
  });

  it("Корректное добавление в head", () => {
    cy.get("@inputValue").type("1");
    cy.get("@addToHead").click();

    cy.clock();

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@circleLetters")
      .first()
      .should((element) => {
        expect(element.text()).contain("1");
      });

    cy.get("@circleColorState")
      .first()
      .should((element) => {
        expect(element[0].classList.value).to.match(RegExp("modified"));
      });

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@circleColorState")
      .first()
      .should((element) => {
        expect(element[0].classList.value).to.match(RegExp("default"));
      });
  });

  it("Корректное добавление в tail", () => {
    cy.get("@inputValue").type("1");
    cy.get("@addToTail").click();

    cy.clock();

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@circleLetters")
      .last()
      .should((element) => {
        expect(element.text()).contain("1");
      });

    cy.get("@circleColorState")
      .last()
      .should((element) => {
        expect(element[0].classList.value).to.match(RegExp("modified"));
      });

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@circleColorState")
      .last()
      .should((element) => {
        expect(element[0].classList.value).to.match(RegExp("default"));
      });
  });

  it("Корректное добавление по индексу", () => {
    const checkSmallCircleInHead = (index: number): void => {
      cy.get("@circleHead")
        .eq(index)
        .within(() => {
          cy.get("@circleHead").contains("1");
          cy.get("@circleColorState").should((element) => {
            expect(element[0].classList.value).to.match(RegExp("changing"));
          });
        });
    };
    const checkPrevCircleStyle = (index: number): void => {
      cy.get("@circleColorState")
        .eq(index)
        .should((element) => {
          expect(element[0].classList.value).to.match(RegExp("changing"));
        });
    };

    cy.get("@inputValue").type("1");
    cy.get("@inputIndex").type("2");

    cy.clock();

    cy.get("@addToIndex").click();

    cy.tick(SHORT_DELAY_IN_MS);

    checkSmallCircleInHead(0);

    cy.tick(SHORT_DELAY_IN_MS);

    checkSmallCircleInHead(1);
    checkPrevCircleStyle(0);

    cy.tick(SHORT_DELAY_IN_MS);

    checkSmallCircleInHead(2);
    checkPrevCircleStyle(1);

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@circleLetters")
      .eq(2)
      .should((element) => {
        expect(element.text()).contain("1");
      });

    cy.get("@circleColorState")
      .eq(2)
      .should((element) => {
        expect(element[0].classList.value).to.match(RegExp("modified"));
      });

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@circleColorState").each((colorState) => {
      expect(colorState[0].classList.value).to.match(RegExp("default"));
    });
  });

  it("Удаление элемента из head", () => {
    cy.get("@testingCircle").then((elements) => {
      cy.wrap(elements.slice(1)).as("expectedElements");
    });

    cy.clock();
    cy.get("@circleLetters")
      .first()
      .within((firstElement) => {
        const initialValue = firstElement.text();
        cy.get("@deleteFromHead").click();

        cy.get("@circleLetters").first().should("be.empty");
        cy.get("@circleTail")
          .first()
          .within((tail) => {
            cy.get("[data-testid='circleColorState']").should((colorState) => {
              expect(colorState[0].classList.value).to.match(
                RegExp("changing")
              );
            });

            cy.get("[data-testid='circleLetter']").should((circleLetter) => {
              expect(circleLetter.text()).contains(initialValue);
            });
          });
      });

    cy.tick(SHORT_DELAY_IN_MS);

    return cy.get("@expectedElements").then((initialElements) => {
      cy.get("@testingCircle").should((elements) => {
        expect(elements).eql(initialElements);
      });
    });
  });

  it("Удаление элемента из tail", () => {
    cy.get("@testingCircle").then((elements) => {
      cy.wrap(elements.slice(0, elements.length - 1)).as("expectedElements");
      cy.wrap(elements).as("initialElements");
    });
    cy.get("@circleLetters")
      .last()
      .then((element) => {
        cy.wrap(element.text()).as("initialValue");
      });

    cy.clock();
    cy.get("@deleteFromTail").click();

    cy.get("@initialElements")
      .last()
      .within(() => {
        cy.get("[data-testid='circleLetter']").should("be.empty");
        cy.get("[data-testid='circleTail']")
          .first()
          .within(() => {
            cy.get("[data-testid='circleColorState']").should((colorState) => {
              expect(colorState[0].classList.value).to.match(
                RegExp("changing")
              );
            });

            cy.get("[data-testid='circleLetter']").then((currentValue) => {
              cy.get("@initialValue").should((initialValue) => {
                expect(currentValue.text()).eql(initialValue);
              });
            });
          });
      });

    cy.tick(SHORT_DELAY_IN_MS);

    return cy.get("@expectedElements").then((initialElements) => {
      cy.get("@testingCircle").should((elements) => {
        expect(elements).eql(initialElements);
      });
    });
  });

  it("Удаление элемента по индексу", () => {
    const testIndex = 2;

    cy.get("@testingCircle").then((elements) => {
      let tempArray = elements.toArray();
      tempArray.splice(testIndex, 1);
      cy.wrap(tempArray).as("expectedElements");
      cy.wrap(elements).as("initialElements");
    });

    cy.get("@circleLetters")
      .eq(testIndex)
      .then((element) => {
        cy.wrap(element.text()).as("initialValue");
      });

    const checkElementStyle = (index: number): void => {
      cy.get("@initialElements")
        .eq(index)
        .get("[data-testid='circleColorState']")
        .should((element) => {
          expect(element[0].classList.value).to.match(RegExp("changing"));
        });
    };

    cy.get("@inputIndex").type(String(testIndex));

    cy.clock();
    cy.get("@deleteFromIndex").click();

    cy.tick(SHORT_DELAY_IN_MS);

    checkElementStyle(0);

    cy.tick(SHORT_DELAY_IN_MS);

    checkElementStyle(1);

    cy.tick(SHORT_DELAY_IN_MS);

    checkElementStyle(2);

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@initialElements")
      .eq(2)
      .within(() => {
        cy.get("[data-testid='circleLetter']").should("be.empty");
        cy.get("[data-testid='circleTail']")
          .first()
          .within(() => {
            cy.get("[data-testid='circleColorState']").should((colorState) => {
              expect(colorState[0].classList.value).to.match(
                RegExp("changing")
              );
            });

            cy.get("[data-testid='circleLetter']").then((currentValue) => {
              cy.get("@initialValue").should((initialValue) => {
                expect(currentValue.text()).eql(initialValue);
              });
            });
          });
      });

    cy.tick(SHORT_DELAY_IN_MS);

    return cy.get("@expectedElements").then((initialElements) => {
      cy.get("@testingCircle").should((elements) => {
        expect(elements).eql(initialElements);
      });
    });
  });
});
