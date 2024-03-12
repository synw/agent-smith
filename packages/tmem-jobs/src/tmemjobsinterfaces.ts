import { Tmem } from "@agent-smith/tmem";
//import { Tmem } from "../../tmem/src/tmeminterfaces"

interface JobMem {
    isRunning: boolean;
    runningJob: string;
    runningTask: string;
}

interface TaskMem {
    isCompleted: boolean;
    params: any;
    data: any;
}

interface TmemJobs {
    tasks: Tmem<Record<string, TaskMem>>;
    job: Tmem<JobMem>;
    init: () => Promise<void>;
    start: (name: string, tasks: Array<Record<string, any>>) => Promise<void>;
    finish: () => Promise<void>;
    runTask: (id: string, params: any) => Promise<void>;
    reRunTask: (id: string) => Promise<void>;
    finishTask: (id: string, completed: boolean, data?: any) => Promise<void>;
}

export {
    JobMem,
    TaskMem,
    TmemJobs
};