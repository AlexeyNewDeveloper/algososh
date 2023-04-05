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

export const circleStateBasedOn = (item: IItemObject) => {
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
