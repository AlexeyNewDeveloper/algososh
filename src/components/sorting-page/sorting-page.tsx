import React from "react";
import styles from "./sorting-page.module.css";
import { nanoid } from "nanoid";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { swap } from "../../utils/utils";
import { IItemObject } from "../../types/types";
import { delay } from "../../utils/utils";
import { getCircleStateBasedOn } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

interface IDelayInMs {
  delayInMs?: number;
  initialArray?: Array<number>;
}

export const SortingPage: React.FC<IDelayInMs> = ({
  delayInMs,
  initialArray,
}) => {
  const displayDelay = delayInMs ? delayInMs : SHORT_DELAY_IN_MS;

  const [method, setMethod] = React.useState<{
    choice: boolean;
    bubble: boolean;
  }>({
    choice: true,
    bubble: false,
  });
  const [array, setArray] = React.useState<IItemObject[]>([]);
  const [clickSortButton, setClickSortButton] = React.useState<
    "desc" | "asc" | boolean
  >(false);
  const [clickNewArray, setClickNewArray] = React.useState<boolean>(false);

  const randomArr = () => {
    let lengthArr;
    if (initialArray) {
      lengthArr = initialArray.length;
      return Array.from(initialArray, (value) => {
        return {
          value: String(value),
          id: nanoid(),
          modified: false,
          changing: false,
        };
      });
    } else {
      lengthArr = Math.floor(Math.random() * (17 - 3 + 1)) + 3;
      return Array.from({ length: lengthArr }, () => {
        return {
          value: String(Math.floor(Math.random() * 101)),
          id: nanoid(),
          modified: false,
          changing: false,
        };
      });
    }
  };

  const getModifyArray = (
    array: Array<IItemObject>,
    start: number,
    end: number,
    typeSort: "selection" | "bubble" = "selection"
  ) => {
    if (typeSort === "bubble") {
      array[start].changing = true;
      array[end].changing = true;
      if (start >= 1 && array[start - 1].changing) {
        array[start - 1].changing = false;
      }
    } else {
      array[start].changing = true;
      array[end].changing = true;
      if (array[end - 1].changing && array[end - 1] !== array[start]) {
        array[end - 1].changing = false;
      }
    }
    return array;
  };

  const compareElement = (
    firstElement: IItemObject,
    secondElement: IItemObject,
    mode: "biggest" | "smallest"
  ) => {
    if (mode === "biggest") {
      return Number(firstElement.value) < Number(secondElement.value)
        ? secondElement
        : firstElement;
    } else if (mode === "smallest") {
      return Number(firstElement.value) < Number(secondElement.value)
        ? firstElement
        : secondElement;
    } else {
      return secondElement;
    }
  };

  async function bubbleSort(
    array: IItemObject[],
    sorting: string,
    delayNumber: number
  ) {
    let arr = [...array].map((element) => {
      return { ...element, changing: false, modified: false };
    });

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        await delay(() => {
          let modifiedArray = getModifyArray(arr, j, j + 1, "bubble");
          if (
            sorting === "desc" &&
            Number(arr[j].value) < Number(arr[j + 1].value)
          ) {
            swap(modifiedArray, j, j + 1);
          }
          if (
            sorting === "asc" &&
            Number(arr[j].value) > Number(arr[j + 1].value)
          ) {
            swap(modifiedArray, j, j + 1);
          }
          setArray([...modifiedArray]);
        }, delayNumber);
      }
      arr[arr.length - i - 1].changing = false;
      if (arr.length - i >= 2) {
        arr[arr.length - i - 2].changing = false;
      }
      arr[arr.length - i - 1].modified = true;
    }

    setArray([...arr]);
    setClickSortButton(true);
  }

  async function selectionSort(
    array: IItemObject[],
    sorting: string,
    delayNumber: number
  ) {
    const arr = [...array].map((element) => {
      return { ...element, changing: false, modified: false };
    });
    const { length } = arr;
    let exchangedElement: { element: IItemObject; index: number } | null = null;

    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        let modifiedArray = getModifyArray(arr, i, j);

        await delay(() => {
          setArray([...modifiedArray]);
        }, delayNumber);

        if (!exchangedElement) {
          exchangedElement = { element: arr[j], index: j };
        } else {
          exchangedElement.element =
            sorting === "desc"
              ? compareElement(exchangedElement.element, arr[j], "biggest")
              : compareElement(exchangedElement.element, arr[j], "smallest");
          if (exchangedElement.element === arr[j]) {
            exchangedElement.index = j;
          }
        }
      }

      arr[length - 1].changing = false;
      await delay(() => {
        setArray([...arr]);
      }, delayNumber);

      if (exchangedElement) {
        if (
          sorting === "desc" &&
          Number(arr[i].value) < Number(exchangedElement.element.value)
        ) {
          arr[i].changing = false;
          arr[exchangedElement.index].changing = false;
          arr[exchangedElement.index].modified = true;
          setArray([...swap(arr, i, exchangedElement.index)]);
        }
        if (
          sorting === "asc" &&
          Number(arr[i].value) > Number(exchangedElement.element.value)
        ) {
          arr[i].changing = false;
          arr[exchangedElement.index].changing = false;
          arr[exchangedElement.index].modified = true;
          setArray([...swap(arr, i, exchangedElement.index)]);
        }
      }
      arr[i].changing = false;
      arr[i].modified = true;
      exchangedElement = null;
    }
    setArray([...arr]);
    setClickSortButton(true);
  }

  const getNewArray = () => {
    setClickNewArray(true);
    setArray(randomArr());
    setClickSortButton(true);
  };

  const onChangeRadioInput = (e: React.FormEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value === "choice") {
      setMethod({ choice: true, bubble: false });
    }
    if (e.currentTarget.value === "bubble") {
      setMethod({ choice: false, bubble: true });
    }
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.top_content}>
        <RadioInput
          name="method"
          value="choice"
          label="Выбор"
          extraClass="mr-40"
          defaultChecked
          onChange={onChangeRadioInput}
          data-testid="choice"
        />
        <RadioInput
          name="method"
          value="bubble"
          label="Пузырёк"
          extraClass="mr-52"
          onChange={onChangeRadioInput}
          data-testid="bubble"
        />
        <Button
          sorting={Direction.Ascending}
          text="По возрастанию"
          extraClass="mr-12"
          onClick={() => {
            setClickSortButton("asc");
            if (method.choice) {
              selectionSort(array, "asc", displayDelay);
            } else if (method.bubble) {
              bubbleSort(array, "asc", displayDelay);
            }
          }}
          isLoader={clickSortButton === "asc"}
          disabled={clickSortButton === "desc" || !clickSortButton}
          data-testid="asc"
        />
        <Button
          sorting={Direction.Descending}
          text="По убыванию"
          extraClass="mr-80"
          onClick={() => {
            setClickSortButton("desc");
            if (method.choice) {
              selectionSort(array, "desc", displayDelay);
            } else if (method.bubble) {
              bubbleSort(array, "desc", displayDelay);
            }
          }}
          isLoader={clickSortButton === "desc"}
          disabled={clickSortButton === "asc" || !clickSortButton}
          data-testid="desc"
        />
        <Button
          text="Новый массив"
          onClick={getNewArray}
          disabled={clickSortButton === "asc" || clickSortButton === "desc"}
          data-testid="getNewArray"
        />
      </div>
      {clickNewArray && (
        <div className={styles.result_box} data-testid="resultBox">
          {array.map((element, index, arr) => {
            const columnState = getCircleStateBasedOn(element);
            return (
              <Column
                key={element.id}
                state={columnState}
                index={Number(element.value)}
                extraClass={index === arr.length - 1 ? "" : "mr-10"}
              />
            );
          })}
        </div>
      )}
    </SolutionLayout>
  );
};
