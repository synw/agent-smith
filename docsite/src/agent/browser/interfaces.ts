import { ModelConf } from "@locallm/types";

interface ExpertModelConf extends ModelConf {
    url: string | Array<string>;
    template: string;
}

interface OnLoadProgressData {
    total: number;
    loaded: number;
    percent: number;
}

type OnLoadProgress = (data: OnLoadProgressData) => void;

export { ExpertModelConf, OnLoadProgress }