import { nanoid } from "nanoid";
import { ElementStates } from "../types/element-states";
import { IItemObject } from "../types/types";

export const swap = (
  arr: Array<any>,
  firstIndex: number,
  secondIndex: number
): any[] => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
  return arr;
};

export const getCircleStateBasedOn = (item: IItemObject) => {
  return item.changing
    ? ElementStates.Changing
    : item.modified
    ? ElementStates.Modified
    : ElementStates.Default;
};

export async function delay(func: () => void, delay: number) {
  return new Promise((res) =>
    setTimeout(() => {
      func();
      res(true);
    }, delay)
  );
}

export const isPressedButton = (nameButtons: {
  [name: string]: boolean;
}): boolean => {
  for (let key in nameButtons) {
    if (nameButtons[key] === true) {
      return true;
    }
  }
  return false;
};

export const randomArr = (min: number, max: number, maxValue: number) => {
  const lengthArr = Math.floor(Math.random() * (max - min + 1)) + min;

  return Array.from({ length: lengthArr }, () => {
    return Math.floor(Math.random() * maxValue + 1);
  });
};
