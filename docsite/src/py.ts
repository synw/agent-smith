import { usePython } from "usepython";

const py = usePython();

// python runtime
const pipPackages = ["altair", "vega_datasets"];
const pyodidePackages = ["pandas"];

// some Python code to run after install
const initCode: string | undefined = undefined;

async function initPy() {
    await py.load(pyodidePackages, pipPackages, initCode)
}

export { py, initPy }