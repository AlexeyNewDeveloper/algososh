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
import { isPressedButton, randomArr } from "../../utils/utils";
import { getCircleStateBasedOn } from "../../utils/utils";
import { ElementStates } from "../../types/element-states";
import { LinkedList } from "./utils";
import { delay } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { MAX_LENGTH } from "./utils";

const list = new LinkedList<IItemObject>(randomArr(3, 6, 9999));

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
    displayedTextArray: list.toArray(),
  });
  const { values, handleChange, setValues } = useForm<{
    [name: string]: string | number | null;
    textValue: string | null;
    textIndex: number | null;
  }>({
    textValue: null,
    textIndex: null,
  });

  const displayChangingValue = (
    changingValue: IItemObject,
    arr: Array<IItemObject>,
    changingElementIndex: number
  ) => {
    const isNotHeadOrTail =
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
    arr: Array<IItemObject>
  ) => {
    changingValue.modified = false;
    setArrayText({ displayedTextArray: arr });
  };

  const displayFinishDeleteValue = (
    arr: Array<IItemObject>,
    changingElementIndex: number
  ) => {
    for (let i = 0; i <= changingElementIndex; i++) {
      arr[i].changing = false;
    }
    arr.splice(changingElementIndex, 1);
    setArrayText({ displayedTextArray: arr });
    setChangingElement(null);
  };

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
        list.addByIndex(insertedValue, 0);
        setChangingElement(currentChangingElement);
        await delay(() => {
          if (insertedValue) {
            displayChangingValue(insertedValue, arrayOfItems, 0);
          }
        }, SHORT_DELAY_IN_MS);
        await delay(() => {
          if (insertedValue) {
            displayFinishChangingValue(insertedValue, arrayOfItems);
          }
        }, SHORT_DELAY_IN_MS);
      }
      if (position === "tail") {
        const lastIndex = arrayOfItems.length - 1;
        list.append(insertedValue);
        setChangingElement({
          ...currentChangingElement,
          changeAt: lastIndex,
        });
        await delay(() => {
          if (insertedValue) {
            displayChangingValue(insertedValue, arrayOfItems, lastIndex + 1);
          }
        }, SHORT_DELAY_IN_MS);
        await delay(() => {
          if (insertedValue) {
            displayFinishChangingValue(insertedValue, arrayOfItems);
          }
        }, SHORT_DELAY_IN_MS);
      }
      if (typeof position === "number") {
        list.addByIndex(insertedValue, position);

        for (let i = 0; i <= position; i++) {
          await delay(() => {
            setChangingElement({
              ...currentChangingElement,
              changeAt: i,
            });
          }, SHORT_DELAY_IN_MS);

          if (i > 0) {
            arrayOfItems[i - 1].changing = true;
          }

          setArrayText({ displayedTextArray: [...arrayOfItems] });
        }
        await delay(() => {
          if (insertedValue) {
            displayChangingValue(insertedValue, arrayOfItems, position);
          }
        }, SHORT_DELAY_IN_MS);
        await delay(() => {
          if (insertedValue) {
            displayFinishChangingValue(insertedValue, arrayOfItems);
          }
        }, SHORT_DELAY_IN_MS);
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
    let positionIndex: number = 0;
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

    if (position === "head" || position === "tail") {
      list.deleteByIndex(positionIndex);
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

        await delay(() => {
          displayFinishDeleteValue(arr, positionIndex);
        }, SHORT_DELAY_IN_MS);

        setChangingElement(null);
      }
    } else if (typeof position === "number") {
      list.deleteByIndex(position);
      const deletedElement = Object.assign(
        {},
        arrayText.displayedTextArray[position]
      );

      for (let i = 0; i <= position; i++) {
        await delay(() => {
          arr[i].changing = true;
          setArrayText({ displayedTextArray: [...arr] });
        }, SHORT_DELAY_IN_MS);
      }

      await delay(() => {
        arr[position].changing = false;
        setArrayText({ displayedTextArray: [...arr] });
      }, SHORT_DELAY_IN_MS);

      currentChangingElement.element = deletedElement;
      currentChangingElement.toDelete = true;
      currentChangingElement.changeAt = position;

      arr[position].value = "";
      setChangingElement(currentChangingElement);
      setArrayText({ displayedTextArray: arr });

      await delay(() => {
        displayFinishDeleteValue(arr, position);
      }, SHORT_DELAY_IN_MS);
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
            maxLength={MAX_LENGTH}
            extraClass={`${styles.input} mr-6`}
            value={values.textValue ? values.textValue : ""}
            disabled={isPressedButton(clickButton)}
            data-testid="inputValue"
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
              data-testid="addToHead"
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
              data-testid="addToTail"
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
              data-testid="deleteFromHead"
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
              data-testid="deleteFromTail"
            />
          </div>
        </div>
        <div className={styles.top_content}>
          <Input
            placeholder="Введите индекс"
            name="textIndex"
            onChange={(e) => {
              handleChange(e);
              if (Number(e.currentTarget.value) > list.getSize() - 1) {
                setValues({ ...values, textIndex: list.getSize() - 1 });
              }
              if (Number(e.currentTarget.value) < 0) {
                setValues({ ...values, textIndex: 0 });
              }
            }}
            extraClass={`${styles.input} mr-6`}
            value={values.textIndex ? values.textIndex : ""}
            disabled={isPressedButton(clickButton)}
            type="number"
            max={list.getSize() - 1}
            data-testid="inputIndex"
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
              data-testid="addToIndex"
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
              data-testid="deleteFromIndex"
            />
          </div>
        </div>
        <div className={styles.result_box} data-testid="resultBox">
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

                const head =
                  index === 0
                    ? headElement
                    : changingElement?.toAdd &&
                      (clickButton.addByIndex || clickButton.addToTail)
                    ? anotherIndexElement
                    : "";

                const tail =
                  index === lastIndex
                    ? tailElement
                    : changingElement?.toDelete
                    ? anotherIndexElement
                    : "";

                return (
                  <div
                    key={item.id}
                    className={`${styles.circle_with_arrow} mt-45`}
                  >
                    <Circle
                      state={circleState}
                      letter={item.value}
                      index={index}
                      head={head}
                      tail={tail}
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
