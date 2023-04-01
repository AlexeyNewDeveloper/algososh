import React from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { useForm } from "../../hooks/useForm";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { nanoid } from "nanoid";

interface ILetter {
  letter: string;
  id: string;
  modified: boolean;
  changing: boolean;
}

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

const queue = new Queue<ILetter>(7);

const getNewEmptyDisplayedQueue = (length: number): Array<ILetter> => {
  return Array.from({ length }, () => {
    const emptyObject: ILetter = {
      letter: "",
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
    displayedTextArray: Array<ILetter>;
  }>({
    displayedTextArray: getNewEmptyDisplayedQueue(queue.getSize()),
  });
  const { values, handleChange, setValues } = useForm<{
    text: string | null;
  }>({
    text: null,
  });

  const delay = (
    arr: Array<ILetter>,
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

    let insertedValue: ILetter | null = null;
    let arrayOfItems: Array<ILetter> = [...arrayText.displayedTextArray];

    if (values.text) {
      insertedValue = {
        letter: values.text,
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

    let headElementInQueue: ILetter | null = queue.peak();
    let arr: Array<ILetter> = [...arrayText.displayedTextArray];
    if (headElementInQueue) {
      headElementInQueue.changing = true;

      await delay(arr, "delete");
      arr[queue.getHeadIndex()].letter = "";
      arr[queue.getHeadIndex()].changing = false;
      queue.dequeue();
    }

    setArrayText({ displayedTextArray: [...arr] });
  }

  const isPressedButton = () => {
    for (let key in clickButton) {
      if (clickButton[key] === true) {
        return true;
      }
    }
  };

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
            disabled={!values.text || isPressedButton() || queue.isFilled()}
            isLoader={clickButton.add}
          />
          <Button
            text="Удалить"
            extraClass="mr-40"
            onClick={deleteValueButton}
            disabled={queue.isEmpty() || isPressedButton()}
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
              (queue.isEmpty() || isPressedButton()) &&
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
                const circleState = item.changing
                  ? ElementStates.Changing
                  : item.modified
                  ? ElementStates.Modified
                  : ElementStates.Default;

                return (
                  <Circle
                    key={item.id}
                    state={circleState}
                    letter={item.letter}
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
