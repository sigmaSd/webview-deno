// ffi_types.ts
export enum FFIType {
  void = "void",
  i8 = "i8",
  i16 = "i16",
  i32 = "i32",
  i64 = "i64",
  u8 = "u8",
  u16 = "u16",
  u32 = "u32",
  u64 = "u64",
  f32 = "f32",
  f64 = "f64",
  ptr = "pointer",
  pointer = "pointer",
  buffer = "buffer",
  string = "string",
  function = "function",
}

export type DynamicLibrary = {
  // deno-lint-ignore ban-types
  symbols: Record<string, Function>;
  close(): void;
};

export interface FFIFunction {
  args?: FFIType[];
  returns: FFIType;
}

export interface LibraryDefinition {
  [key: string]: FFIFunction;
}

// Add the Pointer type alias
export type Pointer = Deno.PointerValue;
export type CString = (ptr: Deno.PointerValue) => string;

// Re-export CString and JSCallback
export { JSCallback } from "./pointer.ts";
