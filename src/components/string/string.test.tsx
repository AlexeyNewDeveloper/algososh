import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ElementStates } from "../../types/element-states";
import { StringComponent } from "./string";
import { BrowserRouter } from "react-router-dom";

const testingComponent = (
  <BrowserRouter>
    <StringComponent delayInMs={10} />
  </BrowserRouter>
);

describe("Тестирование алгоритма разворота строки", () => {
  it("Корректно разворачивает строку с чётным количеством символов.", async () => {
    render(testingComponent);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");
    const testValue = "Вода";
    const reverseTestValueArray = testValue.split("").reverse();
    const resultTestValueStates = Array.from(
      { length: testValue.length },
      () => ElementStates.Modified
    );

    fireEvent.change(input, { target: { value: testValue } });
    fireEvent.click(button);

    await waitFor(
      () => {
        let resultLetter = screen
          .getAllByTestId("circleLetter")
          .map((circle) => circle.textContent);

        expect(resultLetter).toEqual(reverseTestValueArray);
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        let circleColorStates = screen
          .getAllByTestId("circleColorState")
          .map((circle) => circle.className.split(" ").pop());
        expect(circleColorStates).toEqual(resultTestValueStates);
      },
      { timeout: 2000 }
    );
  });

  it("Корректно разворачивает строку с нечётным количеством символов.", async () => {
    render(testingComponent);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");
    const testValue = "Земля";
    const reverseTestValueArray = testValue.split("").reverse();
    const resultTestValueStates = Array.from(
      { length: testValue.length },
      () => ElementStates.Modified
    );

    fireEvent.change(input, { target: { value: testValue } });
    fireEvent.click(button);

    await waitFor(
      () => {
        let resultLetter = screen
          .getAllByTestId("circleLetter")
          .map((circle) => circle.textContent);

        expect(resultLetter).toEqual(reverseTestValueArray);
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        let circleColorStates = screen
          .getAllByTestId("circleColorState")
          .map((circle) => circle.className.split(" ").pop());
        expect(circleColorStates).toEqual(resultTestValueStates);
      },
      { timeout: 1000 }
    );
  });

  it("Корректно разворачивает строку с одним символом.", async () => {
    render(testingComponent);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");
    const testValue = "В";
    const reverseTestValueArray = testValue.split("").reverse();

    fireEvent.change(input, { target: { value: testValue } });
    fireEvent.click(button);

    let resultLetter = screen
      .getAllByTestId("circleLetter")
      .map((circle) => circle.textContent);

    expect(resultLetter).toEqual(reverseTestValueArray);
  });

  it("Корректно разворачивает пустую строку.", async () => {
    render(testingComponent);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");
    const testValue = "";

    fireEvent.change(input, { target: { value: testValue } });
    expect(button).toBeDisabled();
  });
});
