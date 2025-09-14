import { InferenceBackend } from "./interfaces.js";

const localBackends: Record<string, InferenceBackend> = {
  llamacpp: {
    name: "llamacpp",
    type: "llamacpp",
    url: "http://localhost:8080",
    apiKey: "",
    isDefault: false,
  },
  koboldcpp: {
    name: "koboldcpp",
    type: "koboldcpp",
    url: "http://localhost:5001",
    apiKey: "",
    isDefault: false,
  },
  ollama: {
    name: "ollama",
    type: "ollama",
    url: "http://localhost:11434",
    apiKey: "",
    isDefault: false,
  },
};

export { localBackends }