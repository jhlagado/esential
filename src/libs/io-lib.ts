import { i32 } from 'binaryen';
import { LibFunc } from '../types';
import { literal } from '../typedefs';

export const ioLib: LibFunc = ({ external, func }) => {
  const log = external(
    { namespace: 'env', name: 'log', params: { a: i32 } },

    (a: number) => {
      console.log(a);
      return;
    },
  );

  const print123 = func({}, ({ result }) => {
    result(log(literal(1)), log(literal(2)), log(literal(3)));
  });

  return {
    log,
    print123,
  };
};
