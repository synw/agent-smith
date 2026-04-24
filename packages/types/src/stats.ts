/**
 * Represents the statistics of an inference prompt ingestion time.
 *
 * @interface IngestionStats
 * @param {number} ingestionTime - The time taken to ingest the input data in milliseconds.
 * @param {number} ingestionTimeSeconds - The time taken to ingest the input data in seconds.
 * @example
 * const ingestionStats: IngestionStats = {
 *   ingestionTime: 150,
 *   ingestionTimeSeconds: 0.15
 * };
 */
interface IngestionStats {
    ingestionTime: number;
    ingestionTimeSeconds: number;
}

/**
 * Represents the statistics of an inference.
 *
 * @interface InferenceStats
 * @param {number} ingestionTime - The time taken to ingest the input data in milliseconds.
 * @param {number} inferenceTime - The time taken to perform the inference in milliseconds.
 * @param {number} totalTime - The total time taken to perform the inference in milliseconds.
 * @param {number} ingestionTimeSeconds - The time taken to ingest the input data in seconds.
 * @param {number} inferenceTimeSeconds - The time taken to perform the inference in seconds.
 * @param {number} totalTimeSeconds - The total time taken to perform the inference in seconds.
 * @param {number} totalTokens - The total number of tokens processed.
 * @param {number} tokensPerSecond - The number of tokens processed per second.
 * @example
 * const inferenceStats: InferenceStats = {
 *   ingestionTime: 150,
 *   inferenceTime: 300,
 *   totalTime: 450,
 *   ingestionTimeSeconds: 0.15,
 *   inferenceTimeSeconds: 0.3,
 *   totalTimeSeconds: 0.45,
 *   totalTokens: 200,
 *   tokensPerSecond: 444
 * };
 */
interface InferenceStats extends IngestionStats {
    totalTime: number;
    inferenceTime: number;
    inferenceTimeSeconds: number;
    totalTimeSeconds: number;
    totalTokens: number;
    tokensPerSecond: number;
}

export {
    IngestionStats,
    InferenceStats,
}
