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

  cy.get("[data-testid='circleLetter']").should((elements) => {
    const arrayFromValues = Array.from(elements, (element) => {
      return element.textContent;
    });
    expect(arrayFromValues).eql(arrayOfValue);
  });
};

export const compareStyles = (expectedStyles: string): void => {
  const arrayFromStyles = expectedStyles.split(",");
  cy.get("[data-testid='circleColorState']").should((elements) => {
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

export const addValueToInput = (
  values: string,
  tagInput: string = "@input",
  tagButton: string = "@addButton"
): void => {
  values.split(" ").forEach((value) => {
    cy.get(`${tagInput}`).type(`${value}`);
    cy.get(`${tagButton}`).click();
  });
};

export const createTestQueue = (qLength: number) => {
  let initialArray: string[] = Array.from({ length: qLength }, () => "");

  const addToArray = (value: string, index: number): any => {
    initialArray[index] = value;
  };

  const clear = () => {
    return (initialArray = Array.from({ length: qLength }, () => ""));
  };
  return {
    clear,
    a: (value: string, index: number): any => {
      if (index < qLength) {
        addToArray(value, index);
      }
    },
    getResult: () => {
      return initialArray;
    },
  };
};
