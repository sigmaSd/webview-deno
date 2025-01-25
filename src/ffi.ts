import { dlopen, FFIType, ptr } from "./mod.ts";
import type { Webview } from "./webview.ts";

export function encodeCString(value: string) {
  return ptr(new TextEncoder().encode(value + "\0"));
}

export const instances: Webview[] = [];

/**
 * Unload the library and destroy all webview instances. Should only be run
 * once all windows are closed.
 */
export function unload() {
  for (const instance of instances) instance.destroy();
  lib.close();
}

// Get the library path based on the platform
function getLibraryPath(): Disposable & { $: string } {
  const baseDir = new URL("../build", import.meta.url).pathname;

  let path: string;
  switch (Deno.build.os) {
    case "windows": {
      path = `${baseDir}/libwebview.dll`;
      break;
    }
    case "linux": {
      path = `${baseDir}/libwebview-${
        Deno.build.arch === "x86_64" ? "x64" : "arm64"
      }.so`;
      break;
    }
    case "darwin": {
      path = `${baseDir}/libwebview.dylib`;
      break;
    }
    default:
      throw `unsupported platform: ${Deno.build.os}-${Deno.build.arch}`;
  }

  // NOTE: This is needed so the compiled library can be loaded
  // Deno.dlopen doesn't work currently for embedded files
  const tmpPath = {
    $: Deno.makeTempFileSync(),
    [Symbol.dispose]() {
      Deno.removeSync(this.$);
    },
  };
  Deno.copyFileSync(path, tmpPath.$);
  return tmpPath;
}

// Load the library
using libPath = getLibraryPath();
export const lib = dlopen(libPath.$, {
  webview_create: {
    args: [FFIType.i32, FFIType.ptr],
    returns: FFIType.ptr,
  },
  webview_destroy: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  webview_run: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  webview_terminate: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  webview_get_window: {
    args: [FFIType.ptr],
    returns: FFIType.ptr,
  },
  webview_set_title: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  webview_set_size: {
    args: [FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.i32],
    returns: FFIType.void,
  },
  webview_navigate: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  webview_set_html: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  webview_init: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  webview_eval: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  webview_bind: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.function, FFIType.ptr],
    returns: FFIType.void,
  },
  webview_unbind: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.void,
  },
  webview_return: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i32, FFIType.ptr],
    returns: FFIType.void,
  },
});
