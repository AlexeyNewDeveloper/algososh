import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SortingPage } from "./sorting-page";
import { BrowserRouter } from "react-router-dom";

const testingComponentWithEmptyArray = (
  <BrowserRouter>
    <SortingPage delayInMs={10} initialArray={[]} />
  </BrowserRouter>
);
const testingComponentWithOneElementInArray = (
  <BrowserRouter>
    <SortingPage delayInMs={10} initialArray={[1]} />
  </BrowserRouter>
);
const testingComponentWithSeveralElementsInArray = (
  <BrowserRouter>
    <SortingPage delayInMs={10} initialArray={[3, 2, 5, 7, 3]} />
  </BrowserRouter>
);

describe("Тестирование алгоритмов сортировки выбором и пузырьком", () => {
  describe("Тестирование алгоритмов сортировки выбором.", () => {
    it("Корректно сортирует пустой массив.", () => {
      render(testingComponentWithEmptyArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("asc");

      fireEvent.click(getNewArrayButton);

      const resultBox = screen.getByTestId("resultBox");

      fireEvent.click(directionSortingButton);

      expect(resultBox).toBeEmptyDOMElement();
    });

    it("Корректно сортирует массив из одного элемента.", async () => {
      render(testingComponentWithOneElementInArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("asc");

      fireEvent.click(getNewArrayButton);

      fireEvent.click(directionSortingButton);

      await waitFor(() => {
        let resultIndex = screen
          .getAllByTestId("columnIndex")
          .map((column) => column.textContent);
        expect(resultIndex).toEqual(["1"]);
      });
    });

    it("Корректно сортирует массив из нескольких элементов по убыванию.", async () => {
      render(testingComponentWithSeveralElementsInArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("desc");

      fireEvent.click(getNewArrayButton);

      fireEvent.click(directionSortingButton);

      await waitFor(() => {
        let resultIndex = screen
          .getAllByTestId("columnIndex")
          .map((column) => column.textContent);

        expect(resultIndex).toEqual(["7", "5", "3", "3", "2"]);
      });
    });

    it("Корректно сортирует массив из нескольких элементов по возрастанию.", async () => {
      render(testingComponentWithSeveralElementsInArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("asc");

      fireEvent.click(getNewArrayButton);

      fireEvent.click(directionSortingButton);

      await waitFor(() => {
        let resultIndex = screen
          .getAllByTestId("columnIndex")
          .map((column) => column.textContent);

        expect(resultIndex).toEqual(["2", "3", "3", "5", "7"]);
      });
    });
  });

  describe("Тестирование алгоритмов сортировки пузырьком.", () => {
    it("Корректно сортирует пустой массив.", async () => {
      render(testingComponentWithEmptyArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("asc");
      const methodSorting = screen.getByTestId("bubble");

      fireEvent.click(getNewArrayButton);
      fireEvent.click(methodSorting);

      const resultBox = screen.getByTestId("resultBox");

      fireEvent.click(directionSortingButton);

      expect(resultBox).toBeEmptyDOMElement();
    });

    it("Корректно сортирует массив из одного элемента.", async () => {
      render(testingComponentWithOneElementInArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("asc");
      const methodSorting = screen.getByTestId("bubble");

      fireEvent.click(getNewArrayButton);
      fireEvent.click(methodSorting);

      fireEvent.click(directionSortingButton);

      await waitFor(() => {
        let resultIndex = screen
          .getAllByTestId("columnIndex")
          .map((column) => column.textContent);

        expect(resultIndex).toEqual(["1"]);
      });
    });

    it("Корректно сортирует массив из нескольких элементов по убыванию.", async () => {
      render(testingComponentWithSeveralElementsInArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("desc");
      const methodSorting = screen.getByTestId("bubble");

      fireEvent.click(getNewArrayButton);
      fireEvent.click(methodSorting);

      fireEvent.click(directionSortingButton);

      await waitFor(() => {
        let resultIndex = screen
          .getAllByTestId("columnIndex")
          .map((column) => column.textContent);

        expect(resultIndex).toEqual(["7", "5", "3", "3", "2"]);
      });
    });

    it("Корректно сортирует массив из нескольких элементов по возрастанию.", async () => {
      render(testingComponentWithSeveralElementsInArray);
      const getNewArrayButton = screen.getByTestId("getNewArray");
      const directionSortingButton = screen.getByTestId("asc");
      const methodSorting = screen.getByTestId("bubble");

      fireEvent.click(getNewArrayButton);
      fireEvent.click(methodSorting);

      fireEvent.click(directionSortingButton);

      await waitFor(() => {
        let resultIndex = screen
          .getAllByTestId("columnIndex")
          .map((column) => column.textContent);

        expect(resultIndex).toEqual(["2", "3", "3", "5", "7"]);
      });
    });
  });
});
