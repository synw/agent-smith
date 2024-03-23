#!/usr/bin/env node

import { runserver } from "./server/server.js";
import { extraRoutes } from "./routes/index.js";

async function main() {
    runserver(extraRoutes);
}

(async () => {
    await main();
})();