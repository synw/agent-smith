import type { MapStore } from "nanostores";
import type { TmemJobs } from "@agent-smith/tmem-jobs";

interface AgentTaskSpec<T = string, I = any, O = any, P extends Record<string, any> = Record<string, any>> {
    id: string;
    title: string;
    type?: T;
    description?: string;
    properties?: P;
    run: (params: I, conf?: Record<string, any>) => Promise<O>;
    abort?: (params: I) => Promise<void>;
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

interface AgentTask<T = string, I = any, O = any, P extends Record<string, any> = Record<string, any>> {
    id: string;
    title: string;
    description: string;
    properties: P;
    type: T;
    state: MapStore<AgentTaskState>;
    run: (params: I, conf?: Record<string, any>) => Promise<O>;
    abort: (params?: I) => Promise<void>;
    start: (params: I, conf?: Record<string, any>) => Promise<O>;
    finish: (completed: boolean, data?: O) => void;
}

interface AgentJobSpec<T = string, I = any, O = any, P extends Record<string, any> = Record<string, any>> {
    name: string;
    title: string;
    tasks: Array<AgentTaskSpec<T, I, O, P>>;
    tmem?: TmemJobs;
}

interface AgentJob<T = string> {
    name: string;
    title: string;
    state: MapStore<AgentJobState>;
    tasks: Record<string, AgentTask<T>>;
    tmem: TmemJobs;
    runTask: (name: string, params?: any, conf?: Record<string, any>) => Promise<Record<string, any>>;
    continueTask: (params?: any, conf?: Record<string, any>) => Promise<Record<string, any>>;
    startTask: (name: string, params?: any, conf?: Record<string, any>) => Promise<void>;
    reStartTask: (name: string, params?: any, conf?: Record<string, any>) => Promise<void>;
    finishTask: (completed: boolean, data?: any) => Promise<void>;
    abortTask: (params?: any) => Promise<void>;
    start: () => Promise<void>;
    finish: (success: boolean) => Promise<void>;
    getTaskById: (id: string) => AgentTask<T>;
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
