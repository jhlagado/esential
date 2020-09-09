import { ExpressionRef, Type, Module } from 'binaryen';

export type Ref<T> = { current: T };
export type updateFunc<T> = (item: T) => T;
export type MapFunc<T, R> = (item: T) => R;
export type Entry<T> = [string, T];
export type Dict<T> = { [key: string]: T };
export type Expression = ExpressionRef | ExpressionRef[] | Dict<ExpressionRef>;
export type TypeDef = Type | Type[] | Dict<Type>;

export type Callable = (...params: ExpressionRef[]) => ExpressionRef;
export type Lib = Dict<Callable>;

export type TupleObj = {
  expr: ExpressionRef;
  typeDef: TypeDef;
};

export type VarDefs = Dict<TypeDef>;
export type Vars = Dict<any>;

export type StatementsBlockFunc<T> = (...exprs: ExpressionRef[]) => T;
export type BlockFunc = StatementsBlockFunc<ExpressionRef>;
export type VoidBlockFunc = StatementsBlockFunc<void>;

export type FuncImplDef = {
  $: Vars;
  result: VoidBlockFunc;
  block: BlockFunc;
  exec: VoidBlockFunc;
};
export type Initializer = (funcImplDef: FuncImplDef) => void;

export type LibFunc = (mod: ModDef, args?: Dict<any>) => Dict<any>;

export type CompileOptions = {
  optimize?: boolean;
  validate?: boolean;
};

export type MemDef = {
  namespace: string;
  name: string;
  initial: number;
  maximum?: number;
};

export type ExternalDef = {
  namespace: string;
  name: string;
  id?: string;
  params?: VarDefs;
  result?: TypeDef;
  export?: boolean;
};

export type FuncDef = {
  id?: string;
  params?: VarDefs;
  result?: TypeDef;
  locals?: VarDefs;
  export?: boolean;
};

export type IndirectInfo = {
  index: number;
  id: string;
  paramDefs: Dict<TypeDef>;
  resultDef: TypeDef;
};

export type ModDef = {
  lib: (func: LibFunc, args?: Dict<any>) => any;
  memory: (def: MemDef) => void;
  external: (def: ExternalDef, fn: Function) => Callable;
  func: (def: FuncDef, funcImpl: Initializer) => Callable;
  indirect: (def: FuncDef, funcImpl: Initializer) => any;
  compile: (options?: CompileOptions) => any;
  getIndirectInfo(callable: Callable): IndirectInfo | undefined;
  getModule(): Module;
  emitText: () => string;
};
