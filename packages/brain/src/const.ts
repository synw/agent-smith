import { LmBackendSpec } from "./interfaces.js";

const defaultLocalBackends: Array<LmBackendSpec> = [
  {
    name: "llamacpp",
    providerType: "llamacpp",
    serverUrl: "http://localhost:8080",
    apiKey: "",
    enabled: false,
  },
  {
    name: "koboldcpp",
    providerType: "koboldcpp",
    serverUrl: "http://localhost:5001",
    apiKey: "",
    enabled: false,
  },
  {
    name: "ollama",
    providerType: "ollama",
    serverUrl: "http://localhost:11434",
    apiKey: "",
    enabled: false,
  },
];

export { defaultLocalBackends }