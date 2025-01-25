// pointer.ts
// deno-lint-ignore-file ban-types ban-types
import { convertType } from "./dlopen.ts";

export function ptr(data: Uint8Array): Deno.PointerValue {
  return Deno.UnsafePointer.of(data);
}

// Change CString from a class to a function
export function CString(ptr: Deno.PointerValue): string {
  if (!ptr) {
    throw new Error("Attempted to create a C string from a null pointer");
  }
  const view = new Deno.UnsafePointerView(ptr);
  return view.getCString();
}

export class JSCallback {
  #callback: Function;
  #definition: { parameters: Deno.NativeType[]; result: Deno.NativeType };
  #ptr: Deno.UnsafeCallback;

  constructor(
    callback: Function,
    definition: { args: string[]; returns: string },
  ) {
    this.#callback = callback;
    this.#definition = {
      parameters: definition.args.map(convertType),
      result: convertType(definition.returns),
    };
    this.#ptr = new Deno.UnsafeCallback({
      parameters: this.#definition.parameters,
      result: this.#definition.result,
    }, (...args: unknown[]) => this.#callback(...args));
  }

  get ptr(): Deno.PointerValue {
    return this.#ptr.pointer;
  }

  close() {
    this.#ptr.close();
  }
}
