import fs from 'fs';
import path from 'path';
import { useAgentTask } from "@agent-smith/jobs";

async function readDirectory(dirPath) {
  const result = {};
  try {
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(dirPath, file.name);
        const content = await fs.promises.readFile(filePath, 'utf8');
        result[file.name] = content;
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
  return result;
}

const action = useAgentTask({
  id: "read_dir",
  title: "Read the files content in a directory",
  run: async (args) => {
    //console.debug("git diff args:", args.join(" "));
    const res = {};
    const nextArgs = {};
    for (const arg of args) {
      if (arg.includes("=")) {
        const sp = arg.split("=");
        nextArgs[sp[0]] = sp[1];
        continue
      }
      try {
        const data = await readDirectory(arg);
        res[arg] = data;
      } catch (err) {
        return { ok: false, data: `Error reading directory: ${err}` }
      }
    }
    const files = [];
    for (const [dirname, data] of Object.entries(res)) {
      let safeDirname = dirname;
      if (dirname.endsWith("/")) {
        safeDirname = dirname.substring(0, dirname.length - 1);
      }
      for (const [filename, content] of Object.entries(data)) {
        let txt = `File: ${safeDirname}/${filename}`;
        txt += "\n```\n" + content + "\n```"
        files.push(txt)
      }
    }
    const final = files.join("\n\n")
    return { ok: true, data: { prompt: final, ...nextArgs } }
  }
});

export { action }