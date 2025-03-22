import YAML from 'yaml';
import * as fs from 'fs';
import { FeatureExtension } from '../../interfaces.js';
import { ToolSpec } from 'modprompt';

function _extractToolDoc(filePath: string, startComment: string, endComment: string): { found: boolean, doc: string } {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const startMarker = startComment + '\n# tool';
        if (!fileContent.startsWith(startMarker)) {
            return { found: false, doc: "" };
        }
        const endMarker = endComment;
        const startIndex = fileContent.indexOf(startMarker) + startMarker.length;
        const endIndex = fileContent.indexOf(endMarker, startIndex);
        if (endIndex === -1) {
            throw new Error(`Markers not found in the file: ${filePath}`);
        }
        const extractedContent = fileContent.substring(startIndex, endIndex).trim();
        return { found: true, doc: extractedContent };
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('ENOENT')) {
                throw new Error(`File not found: ${filePath}`);
            } else {
                throw new Error(`Error processing the file: ${filePath}. ${error.message}`);
            }
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

function _extractPyToolDoc(filePath: string): { found: boolean, doc: string } {
    return _extractToolDoc(filePath, '"""', '"""')
}

function _extractJsToolDoc(filePath: string): { found: boolean, doc: string } {
    return _extractToolDoc(filePath, '/*', '*/')
}

function _parseToolDoc(rawTxt: string, name: string): ToolSpec {
    try {

        const res = YAML.parse(rawTxt) as Record<string, any>;
        res["name"] = name;
        return res as ToolSpec
    } catch (e) {
        throw new Error(`Error parsing tool ${name}: data:\n${rawTxt}\n`)
    }

}

function extractToolDoc(name: string, ext: FeatureExtension, dirPath: string): { found: boolean, toolDoc: string } {
    let spec: string;
    let found = false;
    let doc: string;
    switch (ext) {
        case "py":
            let res = _extractPyToolDoc(dirPath + "/" + name + "." + ext);
            found = res.found;
            doc = res.doc;
            break;
        case "js":
            let res2 = _extractJsToolDoc(dirPath + "/" + name + "." + ext);
            found = res2.found;
            doc = res2.doc;
            break;
        default:
            return { found: false, toolDoc: "" }
        //throw new Error(`Unknown tool doc feature type`)        
    }
    if (found) {
        const ts = _parseToolDoc(doc, name);
        spec = JSON.stringify(ts, null, "  ");
    } else {
        return { found: false, toolDoc: "" }
    }
    return { found: true, toolDoc: spec }
}

export {
    extractToolDoc,
}