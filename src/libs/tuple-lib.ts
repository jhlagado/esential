import { i32 } from 'binaryen';
import { LibFunc } from '../types';
import { addLib } from './add-lib';

export const tupleLib: LibFunc = ({ lib, func, literal }) => {
  const { addition } = lib(addLib);

  const returnTwo = func({ export: false }, ({ $, result }) => {
    $.u = [literal(1), literal(2)];
    result($.u);
  });

  const selectRight = func({}, ({ $, result }) => {
    $.u = returnTwo();
    result($.u[1]);
  });

  const addTwo = func({}, ({ $, result }) => {
    $.u = returnTwo();
    result(addition($.u[0], $.u[1]));
  });

  const addThree = func({ params: { a: i32 } }, ({ $, result }) => {
    $.u = returnTwo();
    result(addition($.a, addition($.u[0], $.u[1])));
  });

  return {
    selectRight,
    addTwo,
    addThree,
  };
};
