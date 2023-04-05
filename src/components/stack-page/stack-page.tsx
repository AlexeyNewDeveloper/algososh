import React from "react";
import styles from "./stack-page.module.css";
import { nanoid } from "nanoid";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { useForm } from "../../hooks/useForm";
import { IItemObject } from "../../types/types";
import { isPressedButton } from "../../utils/utils";
import { getCircleStateBasedOn } from "../../utils/utils";
import { Stack } from "./stack";

const stack = new Stack<IItemObject>();

export const StackPage: React.FC = () => {
  const [clickButton, setClickButton] = React.useState<{
    [name: string]: boolean;
  }>({
    add: false,
    delete: false,
    clear: false,
  });
  const [arrayText, setArrayText] = React.useState<{
    displayedTextArray: Array<IItemObject>;
  }>({
    displayedTextArray: [],
  });
  const { values, handleChange, setValues } = useForm<{
    text: string | null;
  }>({
    text: null,
  });

  const delay = (
    arr: Array<IItemObject>,
    buttonName: string,
    delay: number = 500
  ) =>
    new Promise((res) =>
      setTimeout(() => {
        let lastElement = arr[arr.length - 1];
        lastElement.changing = !lastElement.changing;

        setArrayText({ displayedTextArray: arr });
        setClickButton({ ...clickButton, [buttonName]: false });

        res(true);
      }, delay)
    );

  async function addValueButton() {
    setValues({ text: null });
    setClickButton({ ...clickButton, add: true });

    let insertedValue: IItemObject | null = null;
    let arrayOfItems: Array<IItemObject> = [...arrayText.displayedTextArray];

    if (values.text) {
      insertedValue = {
        value: values.text,
        id: nanoid(),
        modified: false,
        changing: true,
      };
    }

    if (insertedValue) {
      stack.push(insertedValue);
      let lastElementInStack = stack.peak();

      if (lastElementInStack) {
        arrayOfItems = [...arrayText.displayedTextArray].concat(
          lastElementInStack
        );

        setArrayText({
          displayedTextArray: [...arrayText.displayedTextArray].concat(
            lastElementInStack
          ),
        });

        await delay(arrayOfItems, "add");
      }
    }
  }

  async function deleteValueButton() {
    setClickButton({ delete: true });

    let lastElementInStack: IItemObject | null = stack.peak();
    let arr: Array<IItemObject> = [...arrayText.displayedTextArray];
    if (lastElementInStack) {
      lastElementInStack.changing = true;
      arr[arr.length - 1] = lastElementInStack;

      await delay(arr, "delete");
      stack.pop();
      arr.pop();
    }

    setArrayText({ displayedTextArray: [...arr] });
  }

  return (
    <SolutionLayout title="Стек">
      <div className={styles.wrap}>
        <div className={styles.top_content}>
          <Input
            name="text"
            onChange={(e) => {
              handleChange(e);
            }}
            isLimitText={true}
            maxLength={4}
            extraClass="mr-6"
            value={values.text ? values.text : ""}
          />
          <Button
            text="Добавить"
            extraClass="mr-6"
            onClick={addValueButton}
            disabled={!values.text || isPressedButton(clickButton)}
            isLoader={clickButton.add}
          />
          <Button
            text="Удалить"
            extraClass="mr-40"
            onClick={deleteValueButton}
            disabled={
              !Boolean(arrayText.displayedTextArray.length) ||
              isPressedButton(clickButton)
            }
            isLoader={clickButton.delete}
          />
          <Button
            text="Очистить"
            onClick={() => {
              stack.clear();
              setArrayText({ displayedTextArray: [] });
            }}
            disabled={
              !Boolean(arrayText.displayedTextArray.length) ||
              isPressedButton(clickButton)
            }
            isLoader={clickButton.clear}
          />
        </div>
        <div className={styles.result_box}>
          {arrayText.displayedTextArray.length
            ? arrayText.displayedTextArray.map((item, index) => {
                const lastIndex = arrayText.displayedTextArray.length - 1;
                const circleState = getCircleStateBasedOn(item);

                return (
                  <Circle
                    key={item.id}
                    state={circleState}
                    letter={item.value}
                    index={index}
                    head={index === lastIndex ? "top" : ""}
                    extraClass={index === lastIndex ? "" : "mr-8"}
                  />
                );
              })
            : null}
        </div>
      </div>
    </SolutionLayout>
  );
};
