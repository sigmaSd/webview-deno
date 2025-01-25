import { Webview } from "../src/index.ts";

const html = `
<html>
    <body>
        <h1>Hello from Deno v${Deno.version.deno} !</h1>
    </body>
</html>
`;

const webview = new Webview();
webview.title = "Bun App";
webview.setHTML(html);
webview.run();
