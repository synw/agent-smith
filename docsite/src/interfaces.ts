import { ModelConf } from "@locallm/types";

interface BrowserModelConf extends ModelConf {
    slug: string;
    url: string | Array<string>;
    template: string;
    isDownloaded: boolean;
}

interface LmExpertConfDef {
    modelName: string;
    modelCtx: number;
    templateName: string;
    description?: string;
    modelUrls?: string | Array<string>;
}

interface LmExpertDef extends LmExpertConfDef {
    name: string;
    backendName: string;
    description?: string;
}

type BackendType = "browser" | "server";

export { BrowserModelConf, BackendType, LmExpertDef, LmExpertConfDef }