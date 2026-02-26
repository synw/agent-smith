import { Router } from "@koa/router";
import { getModelsCmd } from "./models.js";
import { getTaskSettingsCmd, updateTaskSettingsCmd } from "./task_settings.js";
import { getTaskRoute, getTasksRoute } from "./tasks.js";
import { getAgentRoute, getAgentsRoute } from "./agents.js";
import { createConfRoute, getConfRoute } from "./conf.js";
import { getToolsRoute } from "./tools.js";
import { getStateRoute } from "./state.js";

const baseRoutes = new Array<((r: Router) => void)>(
    getConfRoute,
    getTasksRoute,
    getTaskRoute,
    getAgentRoute,
    getAgentsRoute,
    getModelsCmd,
    getToolsRoute,
    getTaskSettingsCmd,
    getStateRoute,
    createConfRoute,
    updateTaskSettingsCmd,
);

export { baseRoutes }