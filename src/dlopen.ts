// dlopen.ts
import { DynamicLibrary, LibraryDefinition } from "./ffi_types.ts";

// Convert FFIType to Deno.NativeType
export function convertType(type: string): Deno.NativeType {
  const typeMap: Record<string, Deno.NativeType> = {
    //@ts-ignore seems to work, TODO check it if it's correct
    void: "void",
    i8: "i8",
    i16: "i16",
    i32: "i32",
    i64: "i64",
    u8: "u8",
    u16: "u16",
    u32: "u32",
    u64: "u64",
    f32: "f32",
    f64: "f64",
    pointer: "pointer",
    buffer: "pointer",
    string: "pointer",
    function: "pointer",
  };

  return typeMap[type] || "pointer";
}

export function dlopen(
  path: string,
  definition: LibraryDefinition,
): DynamicLibrary {
  const library = Deno.dlopen(path, {
    ...Object.entries(definition).reduce(
      (acc, [name, func]) => ({
        ...acc,
        [name]: {
          parameters: func.args?.map(convertType) || [],
          result: convertType(func.returns),
        },
      }),
      {},
    ),
  });

  return {
    symbols: library.symbols,
    close: () => library.close(),
  };
}
