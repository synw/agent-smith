import { MapStore } from "nanostores";

interface AgentTaskSpec {
    name: string,
    title: string,
    run: (params: Record<string, any>) => Promise<Record<string, any>>,
    abort: (params: any) => Promise<void>,
    description?: string,
}

interface AgentTask {
    name: string;
    title: string;
    description?: string;
    state: MapStore<{ isRunning: boolean; isCompleted: boolean }>;
    data: Record<string, any>;
    run: (params: any) => Promise<Record<string, any>>;
    abort: (params?: any) => Promise<void>;
}

interface AgentJob {
    name: string;
    title: string;
    state: MapStore<{
        isRunning: boolean;
        isCompleted: boolean;
        isRunningTask: boolean;
        runningTask: AgentTaskSpec | null;
    }>;
    tasks: Readonly<Array<AgentTaskSpec>>;
    runTask: (name: string, params?: Record<string, any>) => Promise<Record<string, any>>;
    abortTask: (params?: any) => Promise<void>;
    start: () => void;
    finish: (success: boolean) => void;
    getTask: (name: string) => AgentTaskSpec;
}

export {
    AgentJob,
    AgentTask,
    AgentTaskSpec,
}
