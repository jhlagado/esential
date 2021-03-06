import { ExpressionRef, MemorySegment, Type } from 'binaryen';

export type Thunk<T> = () => T;
export type Ref<T> = { current: T };
export type updateFunc<T> = (item: T) => T;
export type MapFunc<T, R> = (item: T) => R;
export type Entry<T> = [string, T];
export type Dict<T> = { [key: string]: T };

export type Accessor = Dict<ExpressionRef> & {
  (expression?: Expression): any;
};
export type Expression = ExpressionRef | ExpressionRef[] | Dict<ExpressionRef> | Accessor;
export type TypeDef = Type | Type[] | Dict<Type>;

export type Signature = {
  params: Dict<TypeDef>;
  result: TypeDef;
};

export type Callable = (...params: Expression[]) => ExpressionRef;

export type VoidBlockFunc = (...exprs: Expression[]) => void ;

export type FuncDef = {
  id?: string;
  params?: Dict<TypeDef>;
  result?: TypeDef;
  locals?: Dict<TypeDef>;
  export?: boolean;
  namespace?: string;
  name?: string;
};

export type ExternalDef = {
  id?: string;
  params?: Dict<TypeDef>;
  result?: TypeDef;
  namespace?: string;
  name?: string;
};

export type IndirectInfo = {
  index: number;
  id: string;
  paramDefs: Dict<TypeDef>;
  resultDef: TypeDef;
};

export type AllocatedDef<T> = {
  namespace?: string;
  name?: string;
  initial?: number;
  maximum?: number;
  instance?: T;
  segments?: MemorySegment[];
};
export type MemoryDef = AllocatedDef<WebAssembly.Memory>;
export type TableDef = AllocatedDef<WebAssembly.Table>;

export type CompileOptions = {
  optimize?: boolean;
  validate?: boolean;
  memory?: MemoryDef;
  table?: TableDef;
  debugRaw?: boolean;
  debugOptimized?: boolean;
};

export type Initializer = (result: VoidBlockFunc, vars: Dict<Accessor>) => void;

export type LibFunc = (mod: EsentialContext, args?: Dict<any>) => Dict<any>;

export type EsentialCfg = {
  memory?: MemoryDef;
  table?: TableDef;
};

export type LibUtils = {
  func: (def: FuncDef, funcImpl?: Initializer) => Callable;
  indirect: (def: FuncDef, funcImpl?: Initializer) => Callable;
  external: (def: ExternalDef) => Callable;
  globals: (varDefs: Dict<TypeDef>, assignments: Dict<Expression>) => void;
  lib: (func: LibFunc, args?: Dict<any>) => any;
};

export type OpUtils = {
  i32: Dict<any>;
  i64: Dict<any>;
  f32: Dict<any>;
  f64: Dict<any>;
  memory: Dict<any>;
};

export type ContextUtils = {
  compile: (options?: CompileOptions) => Uint8Array;
  load: (binary: Uint8Array, imports?: Dict<Dict<any>>) => any;
};

export type EsentialContext = LibUtils & ContextUtils;
