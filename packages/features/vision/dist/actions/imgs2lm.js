import { useAgentTask } from "@agent-smith/jobs";
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

const action = useAgentTask({
    id: "imgs2lm",
    title: "Convert images to base64 strings to pass to an lm task",
    run: async (args) => {
        if (args.length < 1) {
            throw new Error("Provide an image path")
        }
        let prompt = "";
        const imgData = [];
        let i = 0;
        let imgs = [];
        for (const arg of args) {
            if (arg.startsWith("p=")) {
                prompt = arg.slice(2)
            } else {
                let txt;
                try {
                    let data = await getImageBuffer(arg);
                    txt = await convertImageDataToBase64(data);
                    imgData.push(txt);
                } catch (e) {
                    return { ok: false, data: "", error: `Error in image conversion: ${e}` }
                }
                imgs.push(`[img-${i}]`);
                ++i
            }
        }
        if (!prompt) {
            return { ok: false, data: {}, error: 'Please provide a prompt argument: p="my prompt"' }
        }
        const im = imgs.join(" ");
        const pr = im + "\n" + prompt;
        return { ok: true, data: { images: imgData, prompt: pr } }
    }
});

export { action }