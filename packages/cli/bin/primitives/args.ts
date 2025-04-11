function parseInferenceArgs(args: Array<string>): {
    inferenceVars: Record<string, any>,
    currentArgs: Array<string>
} {
    const vars: Record<string, any> = {};
    const nargs = new Array<string>();
    //console.log("ARGS", args);
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=");
            const k = t[0];
            const v = t[1];
            switch (k) {
                case "m":
                    if (v.includes("/")) {
                        const _s = v.split("/");
                        vars.model = _s[0];
                        vars.template = _s[1];
                    } else {
                        vars.model = v;
                    }
                    break;
                case "ip":
                    v.split(",").forEach((p: string) => {
                        const s = p.split(":");
                        vars["inferParams"][s[0]] = parseFloat(s[1]);
                    });
                    break;
                case "s":
                    vars.size = v;
                    break;
                default:
                    vars[k] = v;
                    break;
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