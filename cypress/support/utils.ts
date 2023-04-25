export const compareValues = (expectedString: string): void => {
  const arrayOfValue = expectedString.split("");

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
