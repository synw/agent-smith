interface Cmd {
    cmd: CmdExecutor;
    description: string;
    args?: string;
}

interface FeatureSpec {
    name: string;
    path: string;
    ext: FeatureExtension;
}

interface Features {
    task: Array<{ name: string, path: string, ext: TaskExtension }>;
    cmd: Array<{ name: string, path: string, ext: CmdExtension }>;
    action: Array<{ name: string, path: string, ext: ActionExtension }>;
    workflow: Array<{ name: string, path: string, ext: WorkflowExtension }>;
    adaptater: Array<{ name: string, path: string, ext: AdaptaterExtension }>;
    modelset: Array<{ name: string, path: string, ext: ModelsetExtension }>;
}

interface ConfigFile {
    promptfile?: string;
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

type CmdExecutor = (args: Array<string>, options: any) => Promise<any>;

type InputMode = "manual" | "promptfile" | "clipboard";
type OutputMode = "txt" | "clipboard";
type RunMode = "cli" | "cmd";
type FormatMode = "text" | "markdown";

type FeatureType = "task" | "action" | "cmd" | "workflow" | "adaptater" | "modelset";
type ToolType = "task" | "action" | "cmd" | "workflow";
type ActionExtension = "js" | "mjs" | "py" | "yml";
type TaskExtension = "yml";
type AdaptaterExtension = "js";
type WorkflowExtension = "yml";
type CmdExtension = "js";
type ModelsetExtension = "yml";
type FeatureExtension = TaskExtension | CmdExtension | ActionExtension | WorkflowExtension;
type AliasType = "task" | "action" | "workflow";

export {
    Cmd,
    CmdExecutor,
    InputMode,
    OutputMode,
    RunMode,
    FormatMode,
    FeatureType,
    ActionExtension,
    TaskExtension,
    WorkflowExtension,
    AdaptaterExtension,
    CmdExtension,
    ModelsetExtension,
    FeatureSpec,
    Features,
    ConfigFile,
    FeatureExtension,
    AliasType,
    ToolType,
    Settings,
}