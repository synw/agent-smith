import { default as path } from "path";
import { readFeaturesDir } from "../cmd/sys/read_features.js";
import { FeatureType, Features } from "../interfaces.js";
import { readFeature } from "../db/read.js";

function readFeaturesDirs(featuresPaths: Array<string>): Features {
    const feats: Features = {
        task: [],
        job: [],
        action: [],
        cmd: [],
    };
    featuresPaths.forEach((dir: string) => {
        //console.log("Reading feats in", dir);
        const _f = readFeaturesDir(dir);
        _f.task.forEach((item) => feats.task.push(item));
        _f.job.forEach((item) => feats.job.push(item));
        _f.action.forEach((item) => feats.action.push(item));
        _f.cmd.forEach((item) => feats.cmd.push(item));
    });
    return feats
}

function getFeaturePath(name: string, type: FeatureType): { found: boolean, fpath: string } {
    //console.log("GFP", name, type);
    const { found, data } = readFeature(name, type);
    if (!found) {
        return { found: false, fpath: "" }
    }
    const f = path.join(data.path, name + "." + data.ext);
    return { found: true, fpath: f }
}

export {
    readFeaturesDirs,
    getFeaturePath,
}