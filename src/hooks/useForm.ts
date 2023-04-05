import React from "react";

interface IUseForm<T> {
  values: T;
  changed: boolean;
  handleChange: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.FormEvent<HTMLInputElement>
  ) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useForm<T>(
  inputValues: T,
  changedFlag: boolean = false
): IUseForm<T> {
  const [values, setValues] = React.useState<T>(inputValues);
  const [changed, setChanged] = React.useState<boolean>(false);

  const handleChange = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.FormEvent<HTMLInputElement>
  ): void => {
    if (!changed) {
      setChanged(true);
    }

    const { value, name } = event.target as
      | HTMLButtonElement
      | HTMLInputElement;
    if (changedFlag) {
      setValues({ ...values, [name]: { changed: true, value } });
    } else {
      setValues({ ...values, [name]: value });
    }
  };
  return { values, changed, handleChange, setValues, setChanged };
}
