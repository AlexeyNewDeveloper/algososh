import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Circle } from "./circle";
import { ElementStates } from "../../../types/element-states";

describe("Корректная отрисовка элемента Circle", () => {
  it("Отрисовка Circle без буквы", () => {
    const tree = renderer.create(<Circle letter="" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("Отрисовка Circle с буквами", () => {
    it("Одна буква", () => {
      const tree = renderer.create(<Circle letter="A" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("Две буквы", () => {
      const tree = renderer.create(<Circle letter="AA" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("Три буквы", () => {
      const tree = renderer.create(<Circle letter="AAA" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("Четыре буквы", () => {
      const tree = renderer.create(<Circle letter="AAAA" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it("Отрисовка Circle с head", () => {
    const tree = renderer.create(<Circle head="head" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle с React-элементом в качестве head", () => {
    const tree = renderer
      .create(<Circle head={<Circle letter="A" isSmall={true} />} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle с tail", () => {
    const tree = renderer.create(<Circle tail="tail" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle с React-элементом в качестве tail", () => {
    const tree = renderer
      .create(<Circle tail={<Circle letter="A" isSmall={true} />} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle с index", () => {
    const tree = renderer.create(<Circle index={1} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle с пропсом isSmall", () => {
    const tree = renderer.create(<Circle isSmall={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle в состоянии default", () => {
    const tree = renderer
      .create(<Circle state={ElementStates.Default} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle в состоянии changing", () => {
    const tree = renderer
      .create(<Circle state={ElementStates.Changing} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Отрисовка Circle в состоянии modified", () => {
    const tree = renderer
      .create(<Circle state={ElementStates.Modified} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
