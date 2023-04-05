import React from "react";
import styles from "./list-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { useForm } from "../../hooks/useForm";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { nanoid } from "nanoid";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { IItemObject } from "../../types/types";
import { isPressedButton } from "../../utils/utils";
import { getCircleStateBasedOn } from "../../utils/utils";
import { ElementStates } from "../../types/element-states";

export class Node<T> {
  value: T;
  next: Node<T> | null;
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

interface ILinkedList<T> {
  append: (element: T) => void;
  insertAt: (element: T, position: number) => void;
  getElementByindex: (index: number) => Node<T> | null | undefined;
  deleteElementByIndex: (index: number) => Node<T> | null | undefined;
  getSize: () => number;
  print: () => void;
}

class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;
  constructor() {
    this.head = null;
    this.size = 0;
  }

  append(element: T) {
    const node = new Node(element);
    let curr = this.head;
    if (!this.head) {
      this.head = node;
    } else {
      while (curr) {
        if (!curr.next) {
          curr.next = node;
          break;
        } else {
          curr = curr.next;
        }
      }
    }
    this.size++;
  }

  insertAt(element: T, index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      const node = new Node(element);

      if (index === 0) {
        if (!this.head) {
          this.head = node;
        } else {
          const temp = this.head;
          this.head = node;
          this.head.next = temp;
        }
      } else {
        let curr = this.head;
        let currIndex = 0;

        while (currIndex <= index) {
          if (curr) {
            const tempNextIndex = curr.next;
            currIndex++;
            if (currIndex === index && tempNextIndex) {
              node.next = tempNextIndex;
              curr.next = node;
              break;
            }
            curr = curr.next;
          }
        }
      }

      this.size++;
    }
  }

  getElementByindex(index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      if (index === 0) {
        return this.head;
      } else {
        let curr = this.head;
        let currIndex = 0;

        while (currIndex <= index) {
          if (curr) {
            const tempNextIndex = curr.next;
            currIndex++;
            if (currIndex === index && tempNextIndex) {
              return tempNextIndex;
            }
            curr = curr.next;
          }
        }
      }
    }
  }

  deleteElementByIndex(index: number) {
    if (this.head) {
      let curr: Node<T> | null = this.head;
      let i = 0;
      if (i === index && !curr.next) {
        const temp = curr;
        this.head = null;
        this.size--;
        return temp;
      }
      while (curr) {
        if (i === index) {
          const temp = curr.next;
          const tempDeleteElement = curr;
          this.head = temp;
          this.size--;
          return tempDeleteElement;
        } else {
          curr = curr.next;
          i++;
        }
      }
      return;
    }
  }

  getSize() {
    return this.size;
  }

  print() {
    let curr = this.head;
    let res = "";
    while (curr) {
      res += `${curr.value} `;
      curr = curr.next;
    }
    console.log(res);
  }
}

const initialList = new LinkedList<IItemObject>();

const getInitialList = (
  initialArrayOfValues: Array<any>,
  list: ILinkedList<IItemObject>
) => {
  let displayedArray: Array<IItemObject> = [];
  for (let i = 0; i < initialArrayOfValues.length; i++) {
    let value: IItemObject = {
      value: initialArrayOfValues[i],
      id: nanoid(),
      changing: false,
      modified: false,
    };
    displayedArray.push(value);
    list.append(value);
  }
  return { displayedArray, list };
};

type TClickButton = {
  [name: string]: boolean;
  addToHead: boolean;
  addToTail: boolean;
  deleteFromHead: boolean;
  deleteFromTail: boolean;
  addByIndex: boolean;
  deleteByIndex: boolean;
};

interface IChangingElement {
  element: IItemObject | null;
  changeAt: number;
  toAdd: boolean;
  toDelete: boolean;
}

const { displayedArray, list } = getInitialList([0, 34, 8, 1], initialList);

export const ListPage: React.FC = () => {
  const [changingElement, setChangingElement] =
    React.useState<IChangingElement | null>(null);
  const [clickButton, setClickButton] = React.useState<TClickButton>({
    addToHead: false,
    addToTail: false,
    deleteFromHead: false,
    deleteFromTail: false,
    addByIndex: false,
    deleteByIndex: false,
  });
  const [arrayText, setArrayText] = React.useState<{
    displayedTextArray: Array<IItemObject>;
  }>({
    displayedTextArray: displayedArray,
  });
  const { values, handleChange, setValues } = useForm<{
    [name: string]: string | null;
    textValue: string | null;
    textIndex: string | null;
  }>({
    textValue: null,
    textIndex: null,
  });

  const displayChangingValue = (
    changingValue: IItemObject,
    arr: Array<IItemObject>,
    changingElementIndex: number
  ) => {
    const isNotHeadOrTail: boolean =
      changingElementIndex !== 0 && changingElementIndex !== arr.length;
    if (isNotHeadOrTail) {
      for (let i = 0; i <= changingElementIndex; i++) {
        arr[i].changing = false;
      }
    }
    changingValue.changing = false;
    changingValue.modified = true;
    arr.splice(changingElementIndex, 0, changingValue);
    setArrayText({ displayedTextArray: arr });
    setChangingElement(null);
  };

  const displayFinishChangingValue = (
    changingValue: IItemObject,
    arr: Array<IItemObject>,
    changingElementIndex: number
  ) => {
    changingValue.modified = false;
    setArrayText({ displayedTextArray: arr });
  };

  const displayFinishDeleteValue = (
    changingValue: IItemObject,
    arr: Array<IItemObject>,
    changingElementIndex: number
  ) => {
    const isNotHeadOrTail: boolean =
      changingElementIndex !== 0 && changingElementIndex !== arr.length - 1;
    if (isNotHeadOrTail) {
      for (let i = 0; i <= changingElementIndex; i++) {
        arr[i].changing = false;
      }
    }
    arr.splice(changingElementIndex, 1);
    setArrayText({ displayedTextArray: arr });
    setChangingElement(null);
  };

  function delay(
    func: (
      changingValue: IItemObject,
      arr: Array<IItemObject>,
      insertedElementIndex: number
    ) => void,
    arr: Array<IItemObject>,
    changingValue: IItemObject,
    changingElementIndex: number,
    delay: number = 500
  ) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        func(changingValue, arr, changingElementIndex);
        resolve(true);
      }, delay);
    });
  }

  async function addValueToList(
    buttonName: keyof TClickButton,
    position: "head" | "tail" | number
  ) {
    setValues({ textIndex: null, textValue: null });
    setClickButton({ ...clickButton, [buttonName]: true });

    let insertedValue: IItemObject | null = null;
    let arrayOfItems: Array<IItemObject> = [...arrayText.displayedTextArray];

    if (values.textValue) {
      insertedValue = {
        value: values.textValue,
        id: nanoid(),
        modified: false,
        changing: true,
      };
    }

    if (insertedValue) {
      const currentChangingElement: IChangingElement = {
        element: insertedValue,
        changeAt: 0,
        toAdd: true,
        toDelete: false,
      };

      if (position === "head") {
        list.insertAt(insertedValue, 0);
        setChangingElement(currentChangingElement);
        await delay(displayChangingValue, arrayOfItems, insertedValue, 0);
        await delay(displayFinishChangingValue, arrayOfItems, insertedValue, 0);
      }
      if (position === "tail") {
        const lastIndex = arrayOfItems.length - 1;
        list.append(insertedValue);
        setChangingElement({
          ...currentChangingElement,
          changeAt: lastIndex,
        });
        await delay(
          displayChangingValue,
          arrayOfItems,
          insertedValue,
          lastIndex + 1
        );
        await delay(
          displayFinishChangingValue,
          arrayOfItems,
          insertedValue,
          lastIndex
        );
      }
      if (typeof position === "number") {
        list.insertAt(insertedValue, position);

        for (let i = 0; i <= position; i++) {
          await (() =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setChangingElement({
                  ...currentChangingElement,
                  changeAt: i,
                });
                resolve(true);
              }, 500);
            }))();

          if (i > 0) {
            arrayOfItems[i - 1].changing = true;
          }

          setArrayText({ displayedTextArray: [...arrayOfItems] });
        }
        await delay(
          displayChangingValue,
          arrayOfItems,
          insertedValue,
          position
        );
        await delay(
          displayFinishChangingValue,
          arrayOfItems,
          insertedValue,
          position
        );
      }
    }

    setClickButton({ ...clickButton, [buttonName]: false });
  }

  async function deleteValueFromList(
    buttonName: keyof TClickButton,
    position: "head" | "tail" | number
  ) {
    setValues({ textIndex: null, textValue: null });
    setClickButton({ ...clickButton, [buttonName]: true });

    let arr: Array<IItemObject> = [...arrayText.displayedTextArray];
    let positionIndex;
    if (position === "head") {
      positionIndex = 0;
    } else if (position === "tail") {
      positionIndex = arr.length - 1;
    }

    let currentChangingElement: IChangingElement = {
      element: null,
      changeAt: 0,
      toAdd: true,
      toDelete: false,
    };

    if (
      typeof positionIndex === "number" &&
      (position === "head" || position === "tail")
    ) {
      list.deleteElementByIndex(positionIndex);
      const deletedElement = Object.assign(
        {},
        arrayText.displayedTextArray[positionIndex]
      );
      if (deletedElement) {
        currentChangingElement.element = deletedElement;
        currentChangingElement.toDelete = true;
        currentChangingElement.changeAt = positionIndex;

        arr[positionIndex].value = "";
        setChangingElement(currentChangingElement);
        setArrayText({ displayedTextArray: arr });

        await delay(
          displayFinishDeleteValue,
          arr,
          deletedElement,
          positionIndex
        );

        setChangingElement(null);
      }
    } else if (typeof position === "number") {
      list.deleteElementByIndex(position);
      const deletedElement = Object.assign(
        {},
        arrayText.displayedTextArray[position]
      );

      for (let i = 0; i <= position; i++) {
        await (() =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              arr[i].changing = true;
              setArrayText({ displayedTextArray: [...arr] });

              resolve(true);
            }, 500);
          }))();
      }

      await (() =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            arr[position].changing = false;
            setArrayText({ displayedTextArray: [...arr] });
            resolve(true);
          }, 1000);
        }))();

      currentChangingElement.element = deletedElement;
      currentChangingElement.toDelete = true;
      currentChangingElement.changeAt = position;

      arr[position].value = "";
      setChangingElement(currentChangingElement);
      setArrayText({ displayedTextArray: arr });

      await delay(displayFinishDeleteValue, arr, deletedElement, position);
    }

    setArrayText({ displayedTextArray: [...arr] });
    setClickButton({ ...clickButton, [buttonName]: false });
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={styles.wrap}>
        <div className={`${styles.top_content} mb-6`}>
          <Input
            placeholder="Введите значение"
            name="textValue"
            onChange={(e) => {
              handleChange(e);
            }}
            isLimitText={true}
            maxLength={4}
            extraClass={`${styles.input} mr-6`}
            value={values.textValue ? values.textValue : ""}
            disabled={isPressedButton(clickButton)}
          />
          <div className={styles.buttons}>
            <Button
              text="Добавить в head"
              extraClass={`${styles.button} mr-6`}
              onClick={() => {
                addValueToList("addToHead", "head");
              }}
              disabled={isPressedButton(clickButton) || !values.textValue}
              isLoader={clickButton.addToHead}
              linkedList="small"
            />
            <Button
              text="Добавить в tail"
              extraClass={`${styles.button} mr-6`}
              onClick={() => {
                addValueToList("addToTail", "tail");
              }}
              disabled={isPressedButton(clickButton) || !values.textValue}
              isLoader={clickButton.addToTail}
              linkedList="small"
            />
            <Button
              text="Удалить из head"
              extraClass={`${styles.button} mr-6`}
              onClick={() => {
                deleteValueFromList("deleteFromHead", "head");
              }}
              disabled={
                isPressedButton(clickButton) ||
                !arrayText.displayedTextArray.length
              }
              isLoader={clickButton.deleteFromHead}
              linkedList="small"
            />
            <Button
              text="Удалить из tail"
              onClick={() => {
                deleteValueFromList("deleteFromTail", "tail");
              }}
              disabled={
                isPressedButton(clickButton) ||
                !arrayText.displayedTextArray.length
              }
              isLoader={clickButton.deleteFromTail}
              extraClass={`${styles.deleteFromTail}`}
              linkedList="small"
            />
          </div>
        </div>
        <div className={styles.top_content}>
          <Input
            placeholder="Введите индекс"
            name="textIndex"
            onChange={(e) => {
              handleChange(e);
            }}
            extraClass={`${styles.input} mr-6`}
            value={values.textIndex ? values.textIndex : ""}
            disabled={isPressedButton(clickButton)}
            type="number"
          />
          <div className={styles.buttons}>
            <Button
              text="Добавить по индексу"
              extraClass={`${styles.button} mr-6`}
              onClick={() => {
                addValueToList("addByIndex", Number(values.textIndex));
              }}
              disabled={
                isPressedButton(clickButton) ||
                !Boolean(values.textValue && values.textIndex)
              }
              isLoader={clickButton.addByIndex}
              linkedList="big"
            />
            <Button
              text="Удалить по индексу"
              extraClass={`${styles.button}`}
              onClick={() => {
                deleteValueFromList("deleteByIndex", Number(values.textIndex));
              }}
              disabled={
                isPressedButton(clickButton) ||
                !Boolean(
                  values.textIndex && arrayText.displayedTextArray.length
                )
              }
              isLoader={clickButton.deleteByIndex}
              linkedList="big"
            />
          </div>
        </div>
        <div className={styles.result_box}>
          {arrayText.displayedTextArray.length
            ? arrayText.displayedTextArray.map((item, index) => {
                const lastIndex = arrayText.displayedTextArray.length - 1;
                const headElement =
                  index === 0 ? (
                    changingElement &&
                    changingElement.changeAt === 0 &&
                    !changingElement.toDelete ? (
                      <Circle
                        state={ElementStates.Changing}
                        letter={changingElement.element?.value}
                        isSmall={true}
                      />
                    ) : (
                      "head"
                    )
                  ) : (
                    ""
                  );

                const tailElement =
                  index === lastIndex ? (
                    changingElement &&
                    changingElement.changeAt === lastIndex &&
                    changingElement.toDelete ? (
                      <Circle
                        state={ElementStates.Changing}
                        letter={changingElement.element?.value}
                        isSmall={true}
                      />
                    ) : (
                      "tail"
                    )
                  ) : (
                    ""
                  );

                const anotherIndexElement =
                  changingElement && changingElement.changeAt === index ? (
                    <Circle
                      state={ElementStates.Changing}
                      letter={changingElement.element?.value}
                      isSmall={true}
                    />
                  ) : (
                    ""
                  );
                const circleState = getCircleStateBasedOn(item);

                return (
                  <div
                    key={item.id}
                    className={`${styles.circle_with_arrow} mt-45`}
                  >
                    <Circle
                      state={circleState}
                      letter={item.value}
                      index={index}
                      head={
                        index === 0
                          ? headElement
                          : changingElement?.toAdd &&
                            (clickButton.addByIndex || clickButton.addToTail)
                          ? anotherIndexElement
                          : ""
                      }
                      tail={
                        index === lastIndex
                          ? tailElement
                          : changingElement?.toDelete
                          ? anotherIndexElement
                          : ""
                      }
                      extraClass={
                        index === lastIndex
                          ? "ml-8"
                          : index === 0
                          ? "mr-8"
                          : "mr-8 ml-8"
                      }
                    />
                    {index === lastIndex ? null : <ArrowIcon />}
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </SolutionLayout>
  );
};
