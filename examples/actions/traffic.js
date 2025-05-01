/*
# tool
name: traffic
description: Get the current road traffic conditions
arguments:
    city:
        description: The city or location, e.g. San Francisco, CA
*/

async function action(args) {
    //console.log("Running the traffic tool with args", args);
    return { "traffic": "normal" }
}

export { action }