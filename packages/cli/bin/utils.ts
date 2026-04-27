function parseCommandArgs(args: Array<any>): {
    args: Array<string>,
    options: Record<string, any>,
} {
    //discard the command (last arg)
    args.pop();
    //console.log("Raw command args:", args);
    const res = {
        args: new Array<string>(),
        options: {} as Record<string, any>,
    }
    res.options = args.pop();
    res.args = Array.isArray(args[0]) ? args[0] : args;
    //console.log("PARSE ARGS RES", res.args);
    //console.log("PARSE OPTS RES", res.options);
    return res
}

export {
    parseCommandArgs,
}