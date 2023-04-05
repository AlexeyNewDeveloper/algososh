import React from "react";
import styles from "./fibonacci-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useForm } from "../../hooks/useForm";
import { Circle } from "../ui/circle/circle";
import { delay } from "../../utils/utils";

export const FibonacciPage: React.FC = () => {
  const [clickButton, setClickButton] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [displayedItems, setDisplayedItems] = React.useState<{
    items: Array<number>;
  }>({
    items: [],
  });
  const { values, handleChange, setValues } = useForm<{
    number: string | null;
  }>({
    number: null,
  });

  function getFibonacciNumbers(n: number) {
    let arr: number[] = [1, 1];
    for (let i = 2; i < n + 1; i++) {
      arr.push(arr[i - 2] + arr[i - 1]);
    }
    return arr;
  }

  async function showItems(n: number) {
    let arr = getFibonacciNumbers(n);
    let displayedArr: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      displayedArr.push(arr[i]);
      await delay(() => {
        setDisplayedItems({
          items: displayedArr,
        });
      }, 500);
    }
    setLoading(false);
  }

  const onClickButton = () => {
    setDisplayedItems({
      items: [],
    });
    setClickButton(true);
    setLoading(true);
    setValues({ number: null });
    showItems(Number(values.number));
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={styles.wrap}>
        <div className={styles.content}>
          <Input
            name="number"
            onChange={(e) => {
              handleChange(e);
            }}
            max={19}
            isLimitText={true}
            type="number"
            extraClass="mr-12"
            value={values.number ? values.number : ""}
          />
          <Button
            isLoader={loading}
            disabled={
              !values.number ||
              !Number(values.number) ||
              Number(values.number) > 19
            }
            onClick={onClickButton}
            text="Рассчитать"
          />
        </div>
        {clickButton && (
          <div className={styles.result_box}>
            {displayedItems.items.map((number, index, arr) => {
              return (
                <Circle key={index} letter={String(number)} index={index} />
              );
            })}
          </div>
        )}
      </div>
    </SolutionLayout>
  );
};
