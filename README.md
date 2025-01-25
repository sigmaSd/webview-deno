# webview-deno

Fork of webview-bun

why not use webview-deno?

- This uses gtk4 and webkitgtk6
- It have aarch64 linux builds

```ts
import { Webview } from "jsr:@sigmasd/webview-deno"

const html = `
<html>
    <body>
        <h1>Hello from Deno v${Deno.version.deno} !</h1>
    </body>
</html>
`;

const webview = new Webview();
webview.title = "Deno App";
webview.setHTML(html);
webview.run();
```

You can also compile the app to a self contained executable with deno compile.
