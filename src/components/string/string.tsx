import React from "react";
import { nanoid } from "nanoid";
import styles from "./string.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { swap } from "../../utils/utils";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useForm } from "../../hooks/useForm";
import { Circle } from "../ui/circle/circle";
import { IItemObject } from "../../types/types";
import { getCircleStateBasedOn } from "../../utils/utils";
import { delay } from "../../utils/utils";
import { DELAY_IN_MS } from "../../constants/delays";
import { MAX_LENGTH } from "./utils";

export const StringComponent: React.FC = () => {
  const [clickButton, setClickButton] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [displayedItems, setDisplayedItems] = React.useState<{
    items: Array<IItemObject>;
  }>({
    items: [],
  });
  const { values, handleChange, setValues } = useForm<{
    text: string | null;
  }>({
    text: null,
  });

  const modifyItems = (
    arr: Array<IItemObject>,
    firstIndex: number,
    secondIndex: number
  ) => {
    if (firstIndex >= 1 && secondIndex < arr.length) {
      arr[firstIndex - 1].changing = false;
      arr[firstIndex - 1].modified = true;
      if (arr[secondIndex + 1]) {
        arr[secondIndex + 1].changing = false;
        arr[secondIndex + 1].modified = true;
      }
    }
    arr[firstIndex].changing = true;
    arr[secondIndex].changing = true;
    return arr;
  };

  const getModifyArray = (
    arr: Array<IItemObject>,
    start: number,
    end: number,
    lastIteration: boolean = false
  ) => {
    if (lastIteration) {
      if (arr.length % 2) {
        arr[start - 1].modified = true;
        arr[start].modified = true;
        arr[end + 1].modified = true;
        arr[start - 1].changing = false;
        arr[end + 1].changing = false;
      } else {
        arr[start].modified = true;
        arr[end].modified = true;
        arr[start].changing = false;
        arr[end].changing = false;
      }

      return arr;
    } else {
      return modifyItems(arr, start, end);
    }
  };

  async function swapString(
    [...str]: Array<IItemObject>,
    delayNumber: number = DELAY_IN_MS
  ) {
    let start = 0;
    let end = str.length - 1;
    while (start < end) {
      let modifiedArray = getModifyArray(str, start, end);
      await delay(() => {
        setDisplayedItems({ items: modifiedArray });
      }, delayNumber);

      let changedArray = swap(modifiedArray, start, end);
      await delay(() => {
        setDisplayedItems({ items: changedArray });
      }, delayNumber);

      start++;
      end--;
      if (start >= end) {
        modifiedArray = getModifyArray(str, start, end, true);
        await delay(() => {
          setDisplayedItems({ items: modifiedArray });
        }, delayNumber);
      }
    }
    setLoading(false);
  }

  const onClickButton = () => {
    setValues({ text: null });
    setClickButton(true);
    setLoading(true);

    let arrayOfItemsObject: Array<IItemObject> = [];

    if (values.text) {
      arrayOfItemsObject = values.text.split("").map((value) => {
        return { value, id: nanoid(), modified: false, changing: false };
      });
    }

    setDisplayedItems({
      ...displayedItems,
      items: arrayOfItemsObject,
    });
    swapString(arrayOfItemsObject);
  };

  return (
    <SolutionLayout title="Строка">
      <div className={styles.wrap}>
        <div className={styles.content}>
          <Input
            name="text"
            onChange={(e) => {
              handleChange(e);
            }}
            isLimitText={true}
            maxLength={MAX_LENGTH}
            extraClass="mr-12"
            value={values.text ? values.text : ""}
          />
          <Button
            isLoader={loading}
            onClick={onClickButton}
            text="Развернуть"
            disabled={!values.text}
          />
        </div>
        {clickButton && (
          <div className={styles.result_box}>
            {displayedItems.items.map((letterObj, index, arr) => {
              const circleState = getCircleStateBasedOn(letterObj);
              return (
                <Circle
                  state={circleState}
                  key={letterObj.id}
                  letter={letterObj.value}
                  extraClass={index === arr.length - 1 ? "" : "mr-16"}
                />
              );
            })}
          </div>
        )}
      </div>
    </SolutionLayout>
  );
};
