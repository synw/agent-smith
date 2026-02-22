import { Router } from "@koa/router";
import { getModelsCmd } from "./models.js";
import { getTaskSettingsCmd, updateTaskSettingsCmd } from "./task_settings.js";

const baseRoutes = new Array<((r: Router) => void)>(
    getModelsCmd,
    getTaskSettingsCmd,
    updateTaskSettingsCmd,
);

export { baseRoutes }