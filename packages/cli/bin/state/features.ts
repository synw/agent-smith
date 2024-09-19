import { default as path } from "path";
import { readFeaturesDir } from "../cmd/sys/read_features.js";
import { FeatureExtension, FeatureType, Features } from "../interfaces.js";
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

function getFeatureSpec(name: string, type: FeatureType): { found: boolean, path: string, ext: FeatureExtension } {
    //console.log("GFP", name, type);
    const { found, feature } = readFeature(name, type);
    //console.log("FEAT", feature);
    if (!found) {
        return { found: false, path: "", ext: "yml" }
    }
    const f = path.join(feature.path, name + "." + feature.ext);
    return { found: true, path: f, ext: feature.ext }
}

export {
    readFeaturesDirs,
    getFeatureSpec,
}