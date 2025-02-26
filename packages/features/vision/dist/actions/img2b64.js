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
    id: "img2b64",
    title: "Convert an image file to a base64 string",
    run: async (args) => {
        if (args.length < 1) {
            throw new Error("Provide an image path")
        }
        let txt;
        try {
            const imgPath = args[0];
            let data = await getImageBuffer(imgPath);
            txt = await convertImageDataToBase64(data)
        } catch (e) {
            return { ok: false, data: "", error: `Error in image conversion: ${e}` }
        }
        //console.log("T", txt)
        return { ok: true, data: txt }
    }
});

export { action }