import React from "react";
import styles from "./fibonacci-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useForm } from "../../hooks/useForm";
import { Circle } from "../ui/circle/circle";

export const FibonacciPage: React.FC = () => {
  const [clickButton, setClickButton] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [arrayText, setArrayText] = React.useState<{
    displayedTextArray: Array<number>;
  }>({
    displayedTextArray: [],
  });
  const { values, handleChange } = useForm<{
    number: string | null;
  }>({
    number: null,
  });

  const delayFibIter = (displayedArr: number[], ms: number) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        setArrayText({
          displayedTextArray: displayedArr,
        });
        resolve(true);
      }, ms);
    });

  async function fibIterative(n: number) {
    let arr: number[] = [1, 1];
    let displayedArr: number[] = [];
    for (let i = 2; i < n + 1; i++) {
      arr.push(arr[i - 2] + arr[i - 1]);
    }
    for (let i = 0; i < arr.length; i++) {
      displayedArr.push(arr[i]);
      await delayFibIter(displayedArr, 500);
    }
    setLoading(false);
  }

  const onClickButton = () => {
    setArrayText({
      displayedTextArray: [],
    });
    setClickButton(true);
    setLoading(true);
    fibIterative(Number(values.number));
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
            {arrayText.displayedTextArray.map((number, index, arr) => {
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
