import { MapStore } from "nanostores";
import { TmemJobs } from "../../tmem/src/tmeminterfaces";

interface AgentTaskSpec {
    id: string;
    run?: (params: any) => Promise<Record<string, any>>;
    abort?: (params: any) => Promise<void>;
    title: string;
    description?: string;
}

interface AgentTaskState {
    isRunning: boolean;
    isCompleted: boolean;
    data: any;
}

interface AgentJobState {
    isRunning: boolean;
    isCompleted: boolean;
    isRunningTask: boolean;
    runningTask: string;
}

interface AgentTask {
    id: string;
    title: string;
    description: string;
    state: MapStore<AgentTaskState>;
    run: (params: any) => Promise<Record<string, any>>;
    abort: (params?: any) => Promise<void>;
    start: (params: any) => Promise<Record<string, any>>;
    finish: (completed: boolean, data?: any) => void;
}

interface AgentJobSpec {
    name: string;
    title: string;
    tasks: Array<AgentTaskSpec>;
    tmem?: TmemJobs;
}

interface AgentJob {
    name: string;
    title: string;
    state: MapStore<AgentJobState>;
    tasks: Record<string, AgentTask>;
    tmem?: TmemJobs;
    runTask: (name: string, params?: any) => Promise<Record<string, any>>;
    continueTask: (params?: any) => Promise<Record<string, any>>;
    startTask: (name: string, params?: any) => Promise<void>;
    reStartTask: (name: string) => Promise<void>;
    finishTask: (completed: boolean, data?: any) => Promise<void>;
    abortTask: (params?: any) => Promise<void>;
    start: () => Promise<void>;
    finish: (success: boolean) => Promise<void>;
    getTaskById: (id: string) => AgentTask;
    syncMem: () => Promise<void>;
}

export {
    AgentJob,
    AgentJobSpec,
    AgentTask,
    AgentTaskSpec,
    AgentTaskState,
    AgentJobState,
}
