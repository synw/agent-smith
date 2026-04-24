import { InferenceStats, IngestionStats } from "@agent-smith/types";

const useStats = () => {
    let _start = Date.now();
    const stats: InferenceStats = {
        ingestionTime: 0,
        inferenceTime: 0,
        totalTime: 0,
        ingestionTimeSeconds: 0,
        inferenceTimeSeconds: 0,
        totalTimeSeconds: 0,
        totalTokens: 0,
        tokensPerSecond: 0,
    }

    const start = () => {
        _start = Date.now();
    }

    const inferenceStarts = (): IngestionStats => {
        stats.ingestionTime = Date.now() - _start;
        stats.ingestionTimeSeconds = parseFloat((stats.ingestionTime / 1000).toFixed(1));
        return {
            ingestionTime: stats.ingestionTime,
            ingestionTimeSeconds: stats.inferenceTimeSeconds,
        }
    };

    const inferenceEnds = (totalTokens: number): InferenceStats => {
        const n = Date.now();
        stats.totalTokens = totalTokens;
        stats.totalTime = n - _start;
        stats.inferenceTime = stats.totalTime - stats.ingestionTime;
        stats.tokensPerSecond = _tps(totalTokens, stats.inferenceTime);
        stats.ingestionTimeSeconds = parseFloat((stats.ingestionTime / 1000).toFixed(1));
        stats.inferenceTimeSeconds = parseFloat((stats.inferenceTime / 1000).toFixed(1));
        stats.totalTimeSeconds = parseFloat((stats.totalTime / 1000).toFixed(1));
        return stats
    }

    const _tps = (ntokens: number, inferenceTime: number): number => {
        const timeSec = inferenceTime / 1000;
        const res = ntokens / timeSec;
        return parseFloat(res.toFixed(1));
    }

    return {
        start,
        inferenceStarts,
        inferenceEnds,
    }
}

export { useStats }