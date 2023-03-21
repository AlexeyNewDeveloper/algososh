import React from "react";
import styles from "./sorting-page.module.css";
import { nanoid } from "nanoid";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { swap } from "../../utils/utils";
import { ElementStates } from "../../types/element-states";

interface IColumn {
  number: number;
  id: string;
  modified: boolean;
  changing: boolean;
}

export const SortingPage: React.FC = () => {
  const [array, setArray] = React.useState<IColumn[]>([]);
  const [arrayChanged, setArrayChanged] = React.useState<boolean>(false);
  const [clickNewArray, setClickNewArray] = React.useState<boolean>(false);

  const randomArr = () => {
    const lengthArr = Math.floor(Math.random() * (17 - 3 + 1)) + 3;
    return Array.from({ length: lengthArr }, () => {
      return {
        number: Math.floor(Math.random() * 101),
        id: nanoid(),
        modified: false,
        changing: false,
      };
    });
  };

  const delaySwap = (
    array: Array<IColumn>,
    start: number,
    end: number,
    delay: number = 500
  ) =>
    new Promise((res) =>
      setTimeout(() => {
        array[start].changing = true;
        array[end].changing = true;
        if (array[end - 1].changing && array[end - 1] !== array[start]) {
          array[end - 1].changing = false;
        }
        setArray([...array]);

        res(true);
      }, delay)
    );

  const compareElement = (
    firstElement: IColumn,
    secondElement: IColumn,
    mode: "biggest" | "smallest"
  ) => {
    if (mode === "biggest") {
      return firstElement.number < secondElement.number
        ? secondElement
        : firstElement;
    } else if (mode === "smallest") {
      return firstElement.number < secondElement.number
        ? firstElement
        : secondElement;
    } else {
      return secondElement;
    }
  };

  async function selectionSort(array: IColumn[], sorting: string) {
    const arr = [...array].map((element) => {
      return { ...element, changing: false, modified: false };
    });
    const { length } = arr;
    let lastIteration: boolean = false;
    let exchangedElement: { element: IColumn; index: number } | null = null;
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
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

        if (lastIteration) {
          arr[length - 1].changing = false;
          lastIteration = false;
        }
        if (j === arr.length - 1) {
          lastIteration = true;
        }
        await delaySwap(arr, i, j);
      }

      if (exchangedElement) {
        if (
          sorting === "desc" &&
          arr[i].number < exchangedElement.element.number
        ) {
          arr[i].changing = false;
          arr[exchangedElement.index].changing = false;
          arr[exchangedElement.index].modified = true;
          setArray([...swap(arr, i, exchangedElement.index)]);
        }
        if (
          sorting === "asc" &&
          arr[i].number > exchangedElement.element.number
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

    setArrayChanged(true);
  }

  const getNewArray = () => {
    setClickNewArray(true);
    setArray(randomArr());
    setArrayChanged(false);
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.top_content}>
        <RadioInput
          name="method"
          label="Выбор"
          extraClass="mr-40"
          defaultChecked
        />
        <RadioInput name="method" label="Пузырёк" extraClass="mr-52" />
        <Button
          sorting={Direction.Ascending}
          text="По возрастанию"
          extraClass="mr-12"
          onClick={() => {
            selectionSort(array, "asc");
          }}
        />
        <Button
          sorting={Direction.Descending}
          text="По убыванию"
          extraClass="mr-80"
          onClick={() => {
            if (arrayChanged) {
              setArray([
                ...array.map((element) => {
                  return { ...element, changing: false, modified: false };
                }),
              ]);
            }
            selectionSort(array, "desc");
          }}
        />
        <Button text="Новый массив" onClick={getNewArray} />
      </div>
      {clickNewArray && (
        <div className={styles.result_box}>
          {array.map((element, index, arr) => {
            const columnState = element.changing
              ? ElementStates.Changing
              : element.modified
              ? ElementStates.Modified
              : ElementStates.Default;
            return (
              <Column
                key={element.id}
                state={columnState}
                index={element.number}
                extraClass={index === arr.length - 1 ? "" : "mr-10"}
              />
            );
          })}
        </div>
      )}
    </SolutionLayout>
  );
};
