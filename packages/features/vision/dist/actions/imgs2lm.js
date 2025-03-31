import { convertImageDataToBase64 } from "@locallm/api";
import { readFile } from 'fs/promises';

// Function to read the image file and return a Buffer
async function getImageBuffer(imagePath) {
    try {
        // Read the file asynchronously and get a Buffer
        const buffer = await readFile(imagePath);
        //console.log('Image Buffer:', buffer);
        return buffer;
    } catch (error) {
        console.error('Error reading the image file:', error);
    }
}

async function action(args, conf) {
    //console.log("ARGS", args);
    //console.log("CONF", conf);
    if (args.length < 1) {
        throw new Error("Provide an image path")
    }
    //console.log("ARGS", args)
    let prompt = "";
    const imgData = [];
    let i = 0;
    let imgs = [];
    let nextArgs = {};
    const lastArgIndex = args.length - 1;
    for (const arg of args) {
        //console.log(i, "/", lastArgIndex, arg);
        if (i == lastArgIndex) {
            prompt = arg
        } else {
            if (arg.includes("=")) {
                const as = arg.split("=");
                let name = as[0];
                if (name=="s") {
                    name = "size"
                } else if (name=="m") {
                    name ="model"
                } else if (name=="ip") {
                    name ="inferenceParams"
                }
                nextArgs[name] = as[1]                
            } else {
                let txt;
                try {
                    let data = await getImageBuffer(arg);
                    txt = await convertImageDataToBase64(data);
                    imgData.push(txt);
                } catch (e) {
                    throw new Error(`image conversion: ${e}`)
                }
                imgs.push(`[img-${i}]`);
            }
        }
        ++i
    }
    if (!prompt) {
        throw new Error('Please provide a prompt as the last argument: "my prompt"')
    }
    const im = imgs.join(" ");
    const pr = im + "\n" + prompt;
    //console.log("NA", nextArgs);
    return { images: imgData, prompt: pr, ...nextArgs }
}

export { action }