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
    job: Array<{ name: string, path: string, ext: JobExtension }>;
    cmd: Array<{ name: string, path: string, ext: CmdExtension }>;
    action: Array<{ name: string, path: string, ext: ActionExtension }>;
    workflow: Array<{ name: string, path: string, ext: WorkflowExtension }>;
}

interface ConfigFile {
    promptfile?: string;
    features?: Array<string>;
    plugins?: Array<string>;
}

interface NodeReturnType<T = Record<string, any>> {
    data: T;
    error?: Error;
}

type CmdExecutor = (args: Array<string>, options: any) => Promise<any>;

type InputMode = "manual" | "promptfile" | "clipboard";
type OutputMode = "txt" | "clipboard";
type RunMode = "cli" | "cmd";
type FormatMode = "text" | "markdown";

type FeatureType = "task" | "job" | "action" | "cmd" | "workflow";
type ActionExtension = "js" | "mjs" | "py" | "yml";
type TaskExtension = "yml";
type WorkflowExtension = "yml";
type JobExtension = "yml";
type CmdExtension = "js";
type FeatureExtension = TaskExtension | JobExtension | CmdExtension | ActionExtension | WorkflowExtension;
type AliasType = "task" | "action" | "job" | "workflow";

export {
    Cmd,
    CmdExecutor,
    NodeReturnType,
    InputMode,
    OutputMode,
    RunMode,
    FormatMode,
    FeatureType,
    ActionExtension,
    TaskExtension,
    JobExtension,
    WorkflowExtension,
    CmdExtension,
    FeatureSpec,
    Features,
    ConfigFile,
    FeatureExtension,
    AliasType,
}