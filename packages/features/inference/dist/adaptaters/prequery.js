async function action(args) {
    const nextArgs = {};
    let buf = [];
    args.forEach(arg => {
        if (arg.includes("=")) {
            const [key, value] = arg.split("=");
            if (["m", "s", "ip"].includes(key)) {
                nextArgs[key] = value;
            } else {
                buf.push(arg);
            }
        } else {
            buf.push(arg);
        }
    });
    const res = { prompt: buf.join(" "), ...nextArgs };
    return res;
}

export { action }