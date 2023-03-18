import React from "react";
import { nanoid } from "nanoid";
import styles from "./string.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { swap } from "../../utils/utils";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useForm } from "../../hooks/useForm";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { time } from "console";

interface ILetter {
  letter: string;
  id: string;
  modified: boolean;
  changing: boolean;
}

export const StringComponent: React.FC = () => {
  const [clickButton, setClickButton] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [arrayText, setArrayText] = React.useState<{
    displayedTextArray: Array<ILetter>;
  }>({
    displayedTextArray: [],
  });
  const { values, setValues, handleChange } = useForm<{
    text: string;
  }>({
    text: "",
  });

  const delaySwap = (
    str: Array<any>,
    start: number,
    end: number,
    lastIteration: boolean = false,
    delay: number = 1000
  ) =>
    new Promise((res) =>
      setTimeout(() => {
        if (lastIteration) {
          if (str.length % 2) {
            str[start - 1].modified = true;
            str[start].modified = true;
            str[end + 1].modified = true;
            str[start - 1].changing = false;
            str[end + 1].changing = false;
          } else {
            str[start].modified = true;
            str[end].modified = true;
            str[start].changing = false;
            str[end].changing = false;
          }

          setArrayText({ ...arrayText, displayedTextArray: str });
        } else {
          setArrayText({
            ...arrayText,
            displayedTextArray: swap(str, start, end),
          });
        }

        res(true);
      }, delay)
    );

  async function swapString(str: Array<ILetter>) {
    let start = 0;
    let end = str.length - 1;
    while (start < end) {
      await delaySwap(str, start, end);
      start++;
      end--;
      if (start >= end) {
        await delaySwap(str, start, end, true);
      }
    }
    setLoading(false);
  }

  const onClickButton = () => {
    setClickButton(true);
    setLoading(true);
    const arrayOfLetterObject = values.text.split("").map((letter) => {
      return { letter, id: nanoid(), modified: false, changing: false };
    });
    setArrayText({
      ...arrayText,
      displayedTextArray: arrayOfLetterObject,
    });
    swapString(arrayOfLetterObject);
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
            maxLength={11}
            extraClass="mr-12"
          />
          <Button
            isLoader={loading}
            onClick={onClickButton}
            text="Развернуть"
          />
        </div>
        {clickButton && (
          <div className={styles.result_box}>
            {arrayText.displayedTextArray.map((letterObj, index, arr) => {
              const circleState = letterObj.changing
                ? ElementStates.Changing
                : letterObj.modified
                ? ElementStates.Modified
                : ElementStates.Default;
              return (
                <Circle
                  state={circleState}
                  key={letterObj.id}
                  letter={letterObj.letter}
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
