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
}

interface ConfigFile {
    promptfile: string;
    features: Array<string>;
    plugins: Array<string>;
}

type CmdExecutor = (args: Array<string>, options: any) => Promise<any>;

type InputMode = "manual" | "promptfile" | "clipboard";
type OutputMode = "txt" | "clipboard";
type RunMode = "cli" | "cmd";
type FormatMode = "text" | "markdown";

type FeatureType = "task" | "job" | "action" | "cmd";
type ActionExtension = "js" | "py" | "yml";
type TaskExtension = "yml";
type JobExtension = "yml";
type CmdExtension = "js";
type FeatureExtension = TaskExtension | JobExtension | CmdExtension | ActionExtension;

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
    JobExtension,
    CmdExtension,
    FeatureSpec,
    Features,
    ConfigFile,
    FeatureExtension,
}