import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Корректная отрисовка кнопки", () => {
  it("Отрисовка кнопки с текстом", () => {
    const tree = renderer.create(<Button text="Кнопка с текстом" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Отрисовка кнопки без текста", () => {
    const tree = renderer.create(<Button text="" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Отрисовка заблокированной кнопки", () => {
    const tree = renderer.create(<Button disabled={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Отрисовка кнопки с индикацией загрузки", () => {
    const tree = renderer.create(<Button isLoader={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Корректный вызов коллбека на кнопке", () => {
    const mockCallback = jest.fn();

    render(<Button text="Кнопка" onClick={mockCallback} />);
    const button = screen.getByText("Кнопка");
    fireEvent.click(button);

    expect(mockCallback).toHaveBeenCalled();
  });
});
