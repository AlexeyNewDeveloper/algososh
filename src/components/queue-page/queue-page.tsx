import React from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { useForm } from "../../hooks/useForm";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { nanoid } from "nanoid";
import { IItemObject } from "../../types/types";
import { isPressedButton } from "../../utils/utils";
import { getCircleStateBasedOn } from "../../utils/utils";

interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  isEmpty: () => boolean;
  getSize: () => number;
  getLength: () => number;
  getHeadIndex: () => number;
  getTailIndex: () => number;
  isFilled: () => boolean;
  clear: () => void;
}

export class Queue<T> implements IQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }

    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }

    this.container[this.head % this.size] = null;
    if (this.head < this.size - 1) {
      this.head++;
    }

    this.length -= 1;
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    if (this.length) {
      return this.container[this.head % this.size];
    }
    return null;
  };

  isEmpty = () => this.length === 0;

  getSize = () => this.size;

  getLength = () => this.length;

  getHeadIndex = () => this.head;

  getTailIndex = () => this.tail;

  isFilled = () => this.tail === this.size;

  clear = () => {
    this.container = [];
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  };
}

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

  const delay = (
    arr: Array<IItemObject>,
    buttonName: string,
    delay: number = 500
  ) =>
    new Promise((res) =>
      setTimeout(() => {
        let lastElement = arr[queue.getTailIndex() - 1];
        if (buttonName === "add") {
          lastElement.changing = !lastElement.changing;
        }

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
      arrayOfItems[queue.getTailIndex()] = insertedValue;
      queue.enqueue(insertedValue);
      let lastElementInQueue = queue.peak();

      if (lastElementInQueue) {
        setArrayText({
          displayedTextArray: arrayOfItems,
        });

        await delay(arrayOfItems, "add");
      }
    }
  }

  async function deleteValueButton() {
    setClickButton({ delete: true });

    let headElementInQueue: IItemObject | null = queue.peak();
    let arr: Array<IItemObject> = [...arrayText.displayedTextArray];
    if (headElementInQueue) {
      headElementInQueue.changing = true;

      await delay(arr, "delete");
      arr[queue.getHeadIndex()].value = "";
      arr[queue.getHeadIndex()].changing = false;
      queue.dequeue();
    }

    setArrayText({ displayedTextArray: [...arr] });
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
            maxLength={4}
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
