export const compareValues = (
  expectedString: string,
  queue: string[] = []
): void => {
  let arrayOfValue: string[] = [];
  if (queue.length) {
    arrayOfValue = queue;
  } else {
    arrayOfValue = expectedString.split("");
  }

  cy.get("[data-testid='circle_letter']").should((elements) => {
    const arrayFromValues = Array.from(elements, (element) => {
      return element.textContent;
    });
    expect(arrayFromValues).eql(arrayOfValue);
  });
};

export const compareStyles = (expectedStyles: string): void => {
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

export const compareHeadOrTail = (
  index: number,
  element: string,
  size: number = 7
): void => {
  let queue = Array.from({ length: size }, () => "");
  let testid: string;
  if (element === "head") {
    testid = "circleHead";
  } else if (element === "tail") {
    testid = "circleTail";
  } else {
    return;
  }
  if (index >= 0) {
    queue[index] = element;
  }
  cy.get(`[data-testid='${testid}']`).should((elements) => {
    const arrayFromValues = Array.from(elements, (element) => {
      return element.textContent;
    });
    expect(arrayFromValues).eql(queue);
  });
};
