import { InferenceBackend } from "@agent-smith/types";

const localBackends: Record<string, InferenceBackend> = {
  llamacpp: {
    name: "llamacpp",
    type: "openai",
    url: "http://localhost:8080/v1",
    apiKey: "",
    isDefault: true,
  },
};

export { localBackends }