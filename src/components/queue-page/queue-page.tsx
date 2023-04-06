import React from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { useForm } from "../../hooks/useForm";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { nanoid } from "nanoid";
import { IItemObject } from "../../types/types";
import { isPressedButton } from "../../utils/utils";
import { getCircleStateBasedOn } from "../../utils/utils";
import { Queue } from "./utils";
import { delay } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { MAX_LENGTH } from "./utils";

const queue = new Queue<IItemObject>(7);

const getNewEmptyDisplayedQueue = (length: number): Array<IItemObject> => {
  return Array.from({ length }, () => {
    const emptyObject: IItemObject = {
      value: "",
      id: nanoid(),
      modified: false,
      changing: false,
    };

    return emptyObject;
  });
};

export const QueuePage: React.FC = () => {
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
    displayedTextArray: getNewEmptyDisplayedQueue(queue.getSize()),
  });
  const { values, handleChange, setValues } = useForm<{
    text: string | null;
  }>({
    text: null,
  });

  // const delay = (
  //   arr: Array<IItemObject>,
  //   buttonName: string,
  //   delay: number = 500
  // ) =>
  //   new Promise((res) =>
  //     setTimeout(() => {
  //       let lastElement = arr[queue.getTailIndex() - 1];
  //       if (buttonName === "add") {
  //         lastElement.changing = !lastElement.changing;
  //       }

  //       setArrayText({ displayedTextArray: arr });
  //       setClickButton({ ...clickButton, [buttonName]: false });

  //       res(true);
  //     }, delay)
  //   );

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
      arrayOfItems[queue.getTailIndex()] = insertedValue;
      queue.enqueue(insertedValue);
      let lastElementInQueue = queue.peak();

      if (lastElementInQueue) {
        setArrayText({
          displayedTextArray: arrayOfItems,
        });

        await delay(() => {
          let lastElement = arrayOfItems[queue.getTailIndex() - 1];
          lastElement.changing = !lastElement.changing;

          setArrayText({ displayedTextArray: arrayOfItems });
        }, SHORT_DELAY_IN_MS);

        setClickButton({ ...clickButton, add: false });
      }
    }
  }

  async function deleteValueButton() {
    setClickButton({ delete: true });

    let headElementInQueue: IItemObject | null = queue.peak();
    let arr: Array<IItemObject> = [...arrayText.displayedTextArray];
    if (headElementInQueue) {
      headElementInQueue.changing = true;
      await delay(() => {
        setArrayText({ displayedTextArray: arr });
      }, SHORT_DELAY_IN_MS);

      arr[queue.getHeadIndex()].value = "";
      arr[queue.getHeadIndex()].changing = false;
      queue.dequeue();
    }

    setArrayText({ displayedTextArray: [...arr] });
    setClickButton({ delete: false });
  }

  return (
    <SolutionLayout title="Очередь">
      <div className={styles.wrap}>
        <div className={styles.top_content}>
          <Input
            name="text"
            onChange={(e) => {
              handleChange(e);
            }}
            isLimitText={true}
            maxLength={MAX_LENGTH}
            extraClass="mr-6"
            value={values.text ? values.text : ""}
          />
          <Button
            text="Добавить"
            extraClass="mr-6"
            onClick={addValueButton}
            disabled={
              !values.text || isPressedButton(clickButton) || queue.isFilled()
            }
            isLoader={clickButton.add}
          />
          <Button
            text="Удалить"
            extraClass="mr-40"
            onClick={deleteValueButton}
            disabled={queue.isEmpty() || isPressedButton(clickButton)}
            isLoader={clickButton.delete}
          />
          <Button
            text="Очистить"
            onClick={() => {
              setArrayText({
                displayedTextArray: getNewEmptyDisplayedQueue(queue.getSize()),
              });
              queue.clear();
            }}
            disabled={
              (queue.isEmpty() || isPressedButton(clickButton)) &&
              !(queue.getHeadIndex() === queue.getSize() - 1)
            }
            isLoader={clickButton.clear}
          />
        </div>
        <div className={styles.result_box}>
          {arrayText.displayedTextArray.length
            ? arrayText.displayedTextArray.map((item, index) => {
                const lastIndex = arrayText.displayedTextArray.length - 1;
                const headIndex = queue.getHeadIndex();
                const tailIndex = queue.getTailIndex() - 1;
                const circleState = getCircleStateBasedOn(item);

                return (
                  <Circle
                    key={item.id}
                    state={circleState}
                    letter={item.value}
                    index={index}
                    head={
                      index === headIndex && queue.getTailIndex() ? "head" : ""
                    }
                    tail={index === tailIndex && !queue.isEmpty() ? "tail" : ""}
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
