interface Cmd {
    cmd: CmdExecutor;
    description: string;
    args?: string;
}

interface Feature {
    name: string;
    path: string;
    ext: TaskExtension | JobExtension | CmdExtension | ActionExtension;
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
type RunMode = "cli" | "cmd";
type FormatMode = "text" | "markdown";

type FeatureType = "task" | "job" | "action" | "cmd";
type ActionExtension = "js" | "python" | "system";
type TaskExtension = "yml";
type JobExtension = "yml";
type CmdExtension = "js";

export {
    Cmd,
    CmdExecutor,
    InputMode,
    RunMode,
    FormatMode,
    FeatureType,
    ActionExtension,
    TaskExtension,
    JobExtension,
    CmdExtension,
    Feature,
    Features,
    ConfigFile,
}