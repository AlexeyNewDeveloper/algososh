import renderer, { act } from "react-test-renderer";
import TestRenderer from "react-test-renderer";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { ElementStates } from "../../types/element-states";
import { StringComponent } from "./string";
import { Circle } from "../ui/circle/circle";
import { BrowserRouter } from "react-router-dom";

describe("Тестирование алгоритма разворота строки", () => {
  it("Корректно разворачивает строку с чётным количеством символов.", async () => {
    render(
      <BrowserRouter>
        <StringComponent delayInMs={10} />
      </BrowserRouter>
    );
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
          .getAllByTestId("circle_letter")
          .map((circle) => circle.textContent);

        expect(resultLetter).toEqual(reverseTestValueArray);
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        let circleColorStates = screen
          .getAllByTestId("circle_color_state")
          .map((circle) => circle.className.split(" ").pop());
        expect(circleColorStates).toEqual(resultTestValueStates);
      },
      { timeout: 2000 }
    );
  });

  it("Корректно разворачивает строку с нечётным количеством символов.", async () => {
    render(
      <BrowserRouter>
        <StringComponent delayInMs={10} />
      </BrowserRouter>
    );
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
          .getAllByTestId("circle_letter")
          .map((circle) => circle.textContent);

        expect(resultLetter).toEqual(reverseTestValueArray);
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        let circleColorStates = screen
          .getAllByTestId("circle_color_state")
          .map((circle) => circle.className.split(" ").pop());
        expect(circleColorStates).toEqual(resultTestValueStates);
      },
      { timeout: 1000 }
    );
  });
});
