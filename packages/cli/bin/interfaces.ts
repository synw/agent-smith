import { BaseLmTask, ModelSpec } from "@agent-smith/lmtask";
import { InferenceParams } from "@locallm/types";

interface FeatureVariables {
    required: Array<string>;
    optional: Array<string>;
}

interface FeatureSpec {
    id?: number;
    name: string;
    path: string;
    ext: FeatureExtension;
    variables?: FeatureVariables;
}

interface Features {
    task: Array<{ name: string, path: string, ext: TaskExtension }>;
    cmd: Array<{ name: string, path: string, ext: CmdExtension }>;
    action: Array<{ name: string, path: string, ext: ActionExtension }>;
    workflow: Array<{ name: string, path: string, ext: WorkflowExtension }>;
    adaptater: Array<{ name: string, path: string, ext: AdaptaterExtension }>;
    modelfile: Array<{ name: string, path: string, ext: ModelFileExtension }>;
}

interface ConfigFile {
    promptfile?: string;
    datadir?: string;
    features?: Array<string>;
    plugins?: Array<string>;
}

interface Settings {
    name: string;
    inputmode: InputMode;
    outputmode: OutputMode;
    runmode: RunMode;
    formatmode: FormatMode;
    ischatMode: boolean;
    isdebug: boolean;
    isverbose: boolean;
    promptfile: string;
}

interface DbModelDef {
    id?: number;
    name: string;
    shortname: string;
    data: Record<string, any>;
}

interface ModelfileSpec {
    ctx: number;
    max_tokens: number;
    models: Array<ModelSpec>;
}

interface ModelPack {
    default: string;
    recommended?: Array<string>;
}

interface LmTaskFileSpec extends BaseLmTask {
    ctx: number;
    model?: ModelSpec;
    modelpack?: ModelPack;
    mcp?: McpServerSpec;
}

interface BaseLmTaskConfig {
    templateName: string;
    inferParams: InferenceParams;
}

interface LmTaskConfig extends BaseLmTaskConfig {
    modelname?: string;
    quiet?: boolean;
}

interface FinalLmTaskConfig {
    model?: ModelSpec;
    modelname?: string;
}

interface McpServerSpec {
    command: string;
    arguments: string[];
    tools: string[];
}

interface McpServerTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, { type: string; description: string }>;
        required: string[];
    };
}

type InputMode = "manual" | "promptfile" | "clipboard";
type OutputMode = "txt" | "clipboard";
type RunMode = "cli" | "cmd";
type FormatMode = "text" | "markdown";
type VerbosityMode = "quiet" | "verbose" | "debug";

type FeatureType = "task" | "action" | "cmd" | "workflow" | "adaptater" | "modelfile";
type ToolType = "task" | "action" | "cmd" | "workflow";
type ActionExtension = "js" | "mjs" | "py" | "yml";
type TaskExtension = "yml";
type AdaptaterExtension = "js";
type WorkflowExtension = "yml";
type CmdExtension = "js";
type ModelFileExtension = "yml";
type FeatureExtension = TaskExtension | CmdExtension | ActionExtension | WorkflowExtension | ModelFileExtension;
type AliasType = "task" | "action" | "workflow";

export {
    InputMode,
    VerbosityMode,
    OutputMode,
    RunMode,
    FormatMode,
    FeatureType,
    ActionExtension,
    TaskExtension,
    WorkflowExtension,
    AdaptaterExtension,
    CmdExtension,
    ModelFileExtension,
    FeatureSpec,
    Features,
    ConfigFile,
    FeatureExtension,
    AliasType,
    ToolType,
    Settings,
    DbModelDef,
    ModelSpec,
    ModelfileSpec,
    ModelPack,
    LmTaskFileSpec,
    LmTaskConfig,
    FinalLmTaskConfig,
    McpServerSpec,
    McpServerTool,
}