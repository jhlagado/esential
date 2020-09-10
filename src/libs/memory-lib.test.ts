import { Mod } from '../modules';
import { memoryLib } from './memory-lib';

const { lib, start } = Mod();
lib(memoryLib);
const exported = start();

it('should store a number and return it', () => {
  expect(exported.storeAndLoad(346)).toBe(346);
});
