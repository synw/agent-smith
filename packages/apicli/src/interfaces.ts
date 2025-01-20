interface ServerParams {
    apiKey: string;
    onToken: (token: string) => void;
    url?: string;
    isVerbose?: boolean;
}

export {
    ServerParams,
}