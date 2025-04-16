function parseInferenceArgs(args: Array<string>): {
    inferenceVars: Record<string, any>,
    currentArgs: Array<string>
} {
    const vars: Record<string, any> = { "inferParams": {} };
    const nargs = new Array<string>();
    //console.log("PARSE INFER ARGS", args);
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=");
            const k = t[0];
            const v = t[1];
            switch (k) {
                case "m":
                    if (v.includes("/")) {
                        const _s = v.split("/");
                        vars.modelname = _s[0];
                        vars.templateName = _s[1];
                    } else {
                        vars.modelname = v;
                    }
                    break;
                case "ip":
                    v.split(",").forEach((p: string) => {
                        const s = p.split(":");
                        vars["inferParams"][s[0]] = parseFloat(s[1]);
                    });
                    break;
                default:
                    throw new Error(`unknown arg ${a}`)
            }
        } else {
            nargs.push(a)
        }
    });
    return { inferenceVars: vars, currentArgs: nargs }
}

export {
    parseInferenceArgs,
}