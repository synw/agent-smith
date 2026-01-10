import type { TaskDef, ModelSpec, TaskVariables } from "@agent-smith/task";
import type { InferenceParams, LmProviderType } from "@locallm/types";

interface FeatureSpec {
    id?: number;
    name: string;
    path: string;
    ext: FeatureExtension;
    variables?: TaskVariables;
}

interface Features {
    agent: Array<{ name: string, path: string, ext: AgentExtension }>;
    task: Array<{ name: string, path: string, ext: TaskExtension }>;
    cmd: Array<{ name: string, path: string, ext: CmdExtension }>;
    action: Array<{ name: string, path: string, ext: ActionExtension }>;
    workflow: Array<{ name: string, path: string, ext: WorkflowExtension }>;
    adaptater: Array<{ name: string, path: string, ext: AdaptaterExtension }>;
}

interface ConfInferenceBackend {
    type: LmProviderType;
    url: string;
    apiKey?: string;
}

interface InferenceBackend extends ConfInferenceBackend {
    name: string;
    isDefault?: boolean;
}

interface BackendEntries {
    [key: string]: ConfInferenceBackend | string | Array<"llamacpp" | "koboldcpp" | "ollama">;
}

interface ConfigFile {
    promptfile?: string;
    datadir?: string;
    features?: Array<string>;
    plugins?: Array<string>;
    backends?: BackendEntries;
    tasks?: Record<string, TaskSettings>;
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

interface LmTaskFileSpec extends TaskDef {
    ctx: number;
    mcp?: McpServerSpec;
}

interface BaseLmTaskConfig {
    templateName: string;
    inferParams: InferenceParams;
    debug?: boolean;
}

interface LmTaskConfig extends BaseLmTaskConfig {
    model?: ModelSpec;
    quiet?: boolean;
}

interface FinalLmTaskConfig {
    model?: ModelSpec;
    modelname?: string;
}

interface WorkflowStep {
    name: string;
    type: string;
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

interface TaskSettings {
    model?: string;
    template?: string;
    ctx?: number;
    max_tokens?: number;
    top_k?: number;
    top_p?: number;
    min_p?: number;
    temperature?: number;
    repeat_penalty?: number;
    backend?: string;
}

type InputMode = "manual" | "promptfile" | "clipboard";
type OutputMode = "txt" | "clipboard";
type RunMode = "cli" | "cmd";
type FormatMode = "text" | "markdown";
type VerbosityMode = "quiet" | "verbose" | "debug";

type FeatureType = "task" | "agent" | "action" | "cmd" | "workflow" | "adaptater";
type ToolType = "task" | "agent" | "action" | "cmd" | "workflow";
type ActionExtension = "js" | "mjs" | "py" | "yml";
type TaskExtension = "yml";
type AgentExtension = "yml";
type AdaptaterExtension = "js";
type WorkflowExtension = "yml";
type CmdExtension = "js";
type FeatureExtension = TaskExtension | AgentExtension | CmdExtension | ActionExtension | WorkflowExtension;
type AliasType = "task" | "agent" | "action" | "workflow";

type FeatureExecutor<I = any, O = any> = (params: I, options: Record<string, any>) => Promise<O>;

export {
    InputMode,
    VerbosityMode,
    OutputMode,
    RunMode,
    FormatMode,
    FeatureType,
    ActionExtension,
    TaskExtension,
    AgentExtension,
    WorkflowExtension,
    AdaptaterExtension,
    CmdExtension,
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
    InferenceBackend,
    ConfInferenceBackend,
    FeatureExecutor,
    WorkflowStep,
    TaskSettings,
}