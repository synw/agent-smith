import { ProxyToWorker } from './worker.js';
import { absoluteUrl, bufToText, checkEnvironmentCompatible, isSupportMultiThread, joinBuffers, maybeSortFileByName, padDigits, } from './utils.js';
import CacheManager from './cache-manager.js';
import { MultiDownloads } from './downloader/multi-downloads.js';
/**
 * Logger preset with debug messages suppressed
 */
export const LoggerWithoutDebug = {
    ...console,
    debug: () => { },
};
export class Wllama {
    // The CacheManager singleton, can be accessed by user
    cacheManager;
    proxy = null;
    config;
    pathConfig;
    useMultiThread = false;
    useEmbeddings = false;
    // available when loaded
    bosToken = -1;
    eosToken = -1;
    eotToken = -1;
    addBosToken = false;
    addEosToken = false;
    chatTemplate;
    metadata;
    samplingConfig = {};
    hasEncoder = false;
    decoderStartToken = -1;
    constructor(pathConfig, wllamaConfig = {}) {
        checkEnvironmentCompatible();
        if (!pathConfig)
            throw new Error('AssetsPathConfig is required');
        this.pathConfig = pathConfig;
        this.config = wllamaConfig;
        this.cacheManager = wllamaConfig.cacheManager ?? new CacheManager();
    }
    logger() {
        return this.config.logger ?? console;
    }
    checkModelLoaded() {
        if (!this.isModelLoaded()) {
            throw new Error('loadModel() is not yet called');
        }
    }
    /**
     * Check if the model is loaded via `loadModel()`
     */
    isModelLoaded() {
        return !!this.proxy && !!this.metadata;
    }
    /**
     * Get token ID associated to BOS (begin of sentence) token.
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns -1 if the model is not loaded.
     */
    getBOS() {
        return this.bosToken;
    }
    /**
     * Get token ID associated to EOS (end of sentence) token.
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns -1 if the model is not loaded.
     */
    getEOS() {
        return this.eosToken;
    }
    /**
     * Get token ID associated to EOT (end of turn) token.
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns -1 if the model is not loaded.
     */
    getEOT() {
        return this.eotToken;
    }
    /**
     * Get token ID associated to token used by decoder, to start generating output sequence(only usable for encoder-decoder architecture). In other words, encoder uses normal BOS and decoder uses this token.
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns -1 if the model is not loaded.
     */
    getDecoderStartToken() {
        return this.decoderStartToken;
    }
    /**
     * Get model hyper-parameters and metadata
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns ModelMetadata
     */
    getModelMetadata() {
        this.checkModelLoaded();
        return this.metadata;
    }
    /**
     * Check if we're currently using multi-thread build.
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns true if multi-thread is used.
     */
    isMultithread() {
        this.checkModelLoaded();
        return this.useMultiThread;
    }
    /**
     * Check if the current model uses encoder-decoder architecture
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns true if multi-thread is used.
     */
    isEncoderDecoderArchitecture() {
        this.checkModelLoaded();
        return this.hasEncoder;
    }
    /**
     * Must we add BOS token to the tokenized sequence?
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns true if BOS token must be added to the sequence
     */
    mustAddBosToken() {
        this.checkModelLoaded();
        return this.addBosToken;
    }
    /**
     * Must we add EOS token to the tokenized sequence?
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns true if EOS token must be added to the sequence
     */
    mustAddEosToken() {
        this.checkModelLoaded();
        return this.addEosToken;
    }
    /**
     * Get the jinja chat template comes with the model. It only available if the original model (before converting to gguf) has the template in `tokenizer_config.json`
     *
     * NOTE: This can only being used after `loadModel` is called.
     *
     * @returns the jinja template. null if there is no template in gguf
     */
    getChatTemplate() {
        this.checkModelLoaded();
        return this.chatTemplate ?? null;
    }
    /**
     * Parses a model URL and returns an array of URLs based on the following patterns:
     * - If the input URL is an array, it returns the array itself.
     * - If the input URL is a string in the `gguf-split` format, it returns an array containing the URL of each shard in ascending order.
     * - Otherwise, it returns an array containing the input URL as a single element array.
     * @param modelUrl URL or list of URLs
     */
    parseModelUrl(modelUrl) {
        if (Array.isArray(modelUrl)) {
            return modelUrl;
        }
        const urlPartsRegex = /(?<baseURL>.*)-(?<current>\d{5})-of-(?<total>\d{5})\.gguf$/;
        const matches = modelUrl.match(urlPartsRegex);
        if (!matches ||
            !matches.groups ||
            Object.keys(matches.groups).length !== 3) {
            return [modelUrl];
        }
        const { baseURL, total } = matches.groups;
        const paddedShardIds = Array.from({ length: Number(total) }, (_, index) => (index + 1).toString().padStart(5, '0'));
        return paddedShardIds.map((current) => `${baseURL}-${current}-of-${total}.gguf`);
    }
    /**
     * Download a model to cache, without loading it
     * @param modelUrl URL or list of URLs (in the correct order)
     * @param config
     */
    async downloadModel(modelUrl, config = {}) {
        if (modelUrl.length === 0) {
            throw new Error('modelUrl must be an URL or a list of URLs (in the correct order)');
        }
        if (config.useCache === false) {
            throw new Error('useCache must not be false');
        }
        const multiDownloads = new MultiDownloads(this.logger(), this.parseModelUrl(modelUrl), config.parallelDownloads ?? 3, this.cacheManager, {
            progressCallback: config.progressCallback,
            useCache: true,
            allowOffline: !!config.allowOffline,
            noTEE: true,
        });
        const blobs = await multiDownloads.run();
        await Promise.all(blobs.map(async (blob) => {
            const reader = blob.stream().getReader();
            while (true) {
                const { done } = await reader.read();
                if (done)
                    return;
            }
        }));
    }
    /**
     * Load model from a given URL (or a list of URLs, in case the model is splitted into smaller files)
     * - If the model already been downloaded (via `downloadModel()`), then we will use the cached model
     * - Else, we download the model from internet
     * @param modelUrl URL or list of URLs (in the correct order)
     * @param config
     */
    async loadModelFromUrl(modelUrl, config = {}) {
        if (modelUrl.length === 0) {
            throw new Error('modelUrl must be an URL or a list of URLs (in the correct order)');
        }
        const skipCache = config.useCache === false;
        const multiDownloads = new MultiDownloads(this.logger(), this.parseModelUrl(modelUrl), config.parallelDownloads ?? 3, this.cacheManager, {
            progressCallback: config.progressCallback,
            useCache: !skipCache,
            allowOffline: !!config.allowOffline,
        });
        const blobs = await multiDownloads.run();
        return await this.loadModel(blobs, config);
    }
    /**
     * Load model from a given list of Blob.
     *
     * You can pass multiple buffers into the function (in case the model contains multiple shards).
     *
     * @param ggufBlobs List of Blob that holds data of gguf file.
     * @param config LoadModelConfig
     */
    async loadModel(ggufBlobs, config = {}) {
        const blobs = [...ggufBlobs]; // copy array
        if (blobs.some((b) => b.size === 0)) {
            throw new Error('Input model (or splits) must be non-empty Blob or File');
        }
        maybeSortFileByName(blobs);
        const hasMultipleBuffers = blobs.length > 1;
        if (this.proxy) {
            throw new Error('Module is already initialized');
        }
        // detect if we can use multi-thread
        const supportMultiThread = await isSupportMultiThread();
        if (!supportMultiThread) {
            this.logger().warn('Multi-threads are not supported in this environment, falling back to single-thread');
        }
        const hasPathMultiThread = !!this.pathConfig['multi-thread/wllama.js'] &&
            !!this.pathConfig['multi-thread/wllama.wasm'] &&
            !!this.pathConfig['multi-thread/wllama.worker.mjs'];
        if (!hasPathMultiThread) {
            this.logger().warn('Missing paths to "wllama.js", "wllama.wasm" or "wllama.worker.mjs", falling back to single-thread');
        }
        const hwConccurency = Math.floor((navigator.hardwareConcurrency || 1) / 2);
        const nbThreads = config.n_threads ?? hwConccurency;
        this.useMultiThread =
            supportMultiThread && hasPathMultiThread && nbThreads > 1;
        const mPathConfig = this.useMultiThread
            ? {
                'wllama.js': absoluteUrl(this.pathConfig['multi-thread/wllama.js']),
                'wllama.wasm': absoluteUrl(this.pathConfig['multi-thread/wllama.wasm']),
                'wllama.worker.mjs': absoluteUrl(this.pathConfig['multi-thread/wllama.worker.mjs']),
            }
            : {
                'wllama.js': absoluteUrl(this.pathConfig['single-thread/wllama.js']),
                'wllama.wasm': absoluteUrl(this.pathConfig['single-thread/wllama.wasm']),
            };
        this.proxy = new ProxyToWorker(mPathConfig, this.useMultiThread ? nbThreads : 1, this.config.suppressNativeLog ?? false, this.logger());
        // TODO: files maybe out-of-order
        await this.proxy.moduleInit(blobs.map((blob, i) => ({
            name: hasMultipleBuffers
                ? `model-${padDigits(i + 1, 5)}-of-${padDigits(blobs.length, 5)}.gguf`
                : 'model.gguf',
            blob,
        })));
        // run it
        const startResult = await this.proxy.wllamaStart();
        if (!startResult.success) {
            throw new Error(`Error while calling start function, result = ${startResult}`);
        }
        // load the model
        const loadResult = await this.proxy.wllamaAction('load', {
            ...config,
            use_mmap: true,
            use_mlock: true,
            seed: config.seed || Math.floor(Math.random() * 100000),
            n_ctx: config.n_ctx || 1024,
            n_threads: this.useMultiThread ? nbThreads : 1,
            model_path: hasMultipleBuffers
                ? `/models/model-00001-of-${padDigits(blobs.length, 5)}.gguf`
                : '/models/model.gguf',
        });
        this.bosToken = loadResult.token_bos;
        this.eosToken = loadResult.token_eos;
        this.eotToken = loadResult.token_eot;
        this.useEmbeddings = !!config.embeddings;
        this.metadata = {
            hparams: {
                nVocab: loadResult.n_vocab,
                nCtxTrain: loadResult.n_ctx_train,
                nEmbd: loadResult.n_embd,
                nLayer: loadResult.n_layer,
            },
            meta: loadResult.metadata,
        };
        this.hasEncoder = !!loadResult.has_encoder;
        this.decoderStartToken = loadResult.token_decoder_start;
        this.addBosToken = loadResult.add_bos_token;
        this.addEosToken = loadResult.add_eos_token;
        this.chatTemplate = loadResult.metadata['tokenizer.chat_template'];
        this.logger().debug({ loadResult });
    }
    //////////////////////////////////////////////
    // High level API
    /**
     * Calculate embedding vector for a given text.
     * By default, BOS and EOS tokens will be added automatically. You can use the "skipBOS" and "skipEOS" option to disable it.
     * @param text Input text
     * @returns An embedding vector
     */
    async createEmbedding(text, options = {}) {
        this.checkModelLoaded();
        const opt = {
            skipBOS: false,
            skipEOS: false,
            ...options,
        };
        await this.samplingInit(this.samplingConfig);
        await this.kvClear();
        const tokens = await this.tokenize(text);
        if (this.bosToken && !opt.skipBOS) {
            tokens.unshift(this.bosToken);
        }
        if (this.eosToken && !opt.skipEOS) {
            tokens.push(this.eosToken);
        }
        const result = await this.embeddings(tokens);
        return result;
    }
    /**
     * Make completion for a given text.
     * @param prompt Input text
     * @param options
     * @returns Output completion text (only the completion part)
     */
    async createCompletion(prompt, options) {
        this.checkModelLoaded();
        this.samplingConfig = options.sampling ?? {};
        await this.samplingInit(this.samplingConfig);
        const stopTokens = [
            this.eosToken,
            this.eotToken,
            ...(options.stopTokens ?? []),
        ];
        // process prompt
        let tokens = await this.tokenize(prompt, true);
        if (this.addBosToken && tokens[0] !== this.bosToken) {
            tokens.unshift(this.bosToken);
        }
        // maybe reuse KV cache
        if (options.useCache) {
            tokens = await this.getNonCachedTokens(tokens);
        }
        else {
            await this.kvClear();
        }
        // decode/encode tokens
        await this.samplingAccept(tokens);
        if (this.isEncoderDecoderArchitecture()) {
            await this.encode(tokens);
            await this.decode([this.getDecoderStartToken()], {});
        }
        else {
            await this.decode(tokens, {});
        }
        let outBuf = new Uint8Array();
        // abort signal
        let abort = false;
        const abortSignal = () => {
            abort = true;
        };
        // predict next tokens
        for (let i = 0; i < (options.nPredict ?? Infinity); i++) {
            const sampled = await this.samplingSample();
            if (stopTokens.includes(sampled.token)) {
                break; // stop token
            }
            outBuf = joinBuffers([outBuf, sampled.piece]);
            if (options.onNewToken) {
                options.onNewToken(sampled.token, sampled.piece, bufToText(outBuf), {
                    abortSignal,
                });
            }
            if (abort) {
                break; // abort signal is set
            }
            // decode next token
            await this.samplingAccept([sampled.token]);
            await this.decode([sampled.token], {});
        }
        return bufToText(outBuf);
    }
    //////////////////////////////////////////////
    // Low level API
    /**
     * Create or reset the ctx_sampling
     * @param config
     * @param pastTokens In case re-initializing the ctx_sampling, you can re-import past tokens into the new context
     */
    async samplingInit(config, pastTokens = []) {
        this.checkModelLoaded();
        this.samplingConfig = config;
        const result = await this.proxy.wllamaAction('sampling_init', {
            ...config,
            tokens: pastTokens,
        });
        if (!result.success) {
            throw new Error('Failed to initialize sampling');
        }
    }
    /**
     * Get a list of pieces in vocab.
     * NOTE: This function is slow, should only be used once.
     * @returns A list of Uint8Array. The nth element in the list associated to nth token in vocab
     */
    async getVocab() {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('get_vocab', {});
        return result.vocab.map((arr) => new Uint8Array(arr));
    }
    /**
     * Lookup to see if a token exist in vocab or not. Useful for searching special tokens like "<|im_start|>"
     * NOTE: It will match the whole token, so do not use it as a replacement for tokenize()
     * @param piece
     * @returns Token ID associated to the given piece. Returns -1 if cannot find the token.
     */
    async lookupToken(piece) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('lookup_token', { piece });
        if (!result.success) {
            return -1;
        }
        else {
            return result.token;
        }
    }
    /**
     * Convert a given text to list of tokens
     * @param text
     * @param special Should split special tokens?
     * @returns List of token ID
     */
    async tokenize(text, special = true) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('tokenize', special ? { text, special: true } : { text });
        return result.tokens;
    }
    /**
     * Convert a list of tokens to text
     * @param tokens
     * @returns Uint8Array, which maybe an unfinished unicode
     */
    async detokenize(tokens) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('detokenize', { tokens });
        return new Uint8Array(result.buffer);
    }
    /**
     * Run llama_decode()
     * @param tokens A list of tokens to be decoded
     * @param options
     * @returns n_past (number of tokens so far in the sequence)
     */
    async decode(tokens, options) {
        this.checkModelLoaded();
        if (this.useEmbeddings) {
            throw new Error('embeddings is enabled. Use wllama.setOptions({ embeddings: false }) to disable it.');
        }
        const req = { tokens };
        if (options.skipLogits) {
            req.skip_logits = true;
        }
        const result = await this.proxy.wllamaAction('decode', req);
        if (result.error) {
            throw new Error(result.error);
        }
        else if (!result.success) {
            throw new Error('Cannot decode, unknown error');
        }
        else {
            return { nPast: result.n_past };
        }
    }
    /**
     * Run llama_encode()
     * @param tokens A list of tokens to be encoded
     * @param options Unused for now
     * @returns n_past (number of tokens so far in the sequence)
     */
    async encode(tokens, 
    // @ts-ignore unused variable
    options) {
        this.checkModelLoaded();
        if (!this.hasEncoder) {
            throw new Error('This model does not use encoder-decoder architecture.');
        }
        if (this.useEmbeddings) {
            throw new Error('embeddings is enabled. Use wllama.setOptions({ embeddings: false }) to disable it.');
        }
        const req = { tokens };
        const result = await this.proxy.wllamaAction('encode', req);
        if (result.error) {
            throw new Error(result.error);
        }
        else if (!result.success) {
            throw new Error('Cannot encode, unknown error');
        }
        else {
            return { nPast: result.n_past };
        }
    }
    /**
     * Sample a new token (remember to samplingInit() at least once before calling this function)
     * @returns the token ID and its detokenized value (which maybe an unfinished unicode)
     */
    async samplingSample() {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('sampling_sample', {});
        return {
            piece: new Uint8Array(result.piece),
            token: result.token,
        };
    }
    /**
     * Accept and save a new token to ctx_sampling
     * @param tokens
     */
    async samplingAccept(tokens) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('sampling_accept', { tokens });
        if (!result.success) {
            throw new Error('samplingAccept unknown error');
        }
    }
    /**
     * Get softmax-ed probability of logits, can be used for custom sampling
     * @param topK Get top K tokens having highest logits value. If topK == -1, we return all n_vocab logits, but this is not recommended because it's slow.
     */
    async getLogits(topK = 40) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('get_logits', { top_k: topK });
        const logits = result.logits;
        return logits.map(([token, p]) => ({ token, p }));
    }
    /**
     * Calculate embeddings for a given list of tokens. Output vector is always normalized
     * @param tokens
     * @returns A list of number represents an embedding vector of N dimensions
     */
    async embeddings(tokens) {
        this.checkModelLoaded();
        if (!this.useEmbeddings) {
            throw new Error('embeddings is disabled. Use wllama.setOptions({ embeddings: true }) to enable it.');
        }
        const result = await this.proxy.wllamaAction('embeddings', { tokens });
        if (result.error) {
            throw new Error(result.error);
        }
        else if (!result.success) {
            throw new Error('embeddings unknown error');
        }
        else {
            return result.embeddings;
        }
    }
    /**
     * Remove and shift some tokens from KV cache.
     * Keep n_keep, remove n_discard then shift the rest
     * @param nKeep
     * @param nDiscard
     */
    async kvRemove(nKeep, nDiscard) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('kv_remove', {
            n_keep: nKeep,
            n_discard: nDiscard,
        });
        if (!result.success) {
            throw new Error('kvRemove unknown error');
        }
    }
    /**
     * Clear all tokens in KV cache
     */
    async kvClear() {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('kv_clear', {});
        if (!result.success) {
            throw new Error('kvClear unknown error');
        }
    }
    /**
     * Save session to file (virtual file system)
     * TODO: add ability to download the file
     * @param filePath
     * @returns List of tokens saved to the file
     */
    async sessionSave(filePath) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('session_save', {
            session_path: filePath,
        });
        return result;
    }
    /**
     * Load session from file (virtual file system)
     * TODO: add ability to download the file
     * @param filePath
     *
     */
    async sessionLoad(filePath) {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('session_load', {
            session_path: filePath,
        });
        if (result.error) {
            throw new Error(result.error);
        }
        else if (!result.success) {
            throw new Error('sessionLoad unknown error');
        }
    }
    /**
     * Set options for underlaying llama_context
     */
    async setOptions(opt) {
        this.checkModelLoaded();
        await this.proxy.wllamaAction('set_options', opt);
        this.useEmbeddings = opt.embeddings;
    }
    /**
     * Unload the model and free all memory.
     *
     * Note: This function will NOT crash if model is not yet loaded
     */
    async exit() {
        await this.proxy?.wllamaExit();
    }
    /**
     * get debug info
     */
    async _getDebugInfo() {
        this.checkModelLoaded();
        return await this.proxy.wllamaDebug();
    }
    ///// Prompt cache utils /////
    async getCachedToken() {
        this.checkModelLoaded();
        const result = await this.proxy.wllamaAction('current_status', {});
        return result.tokens;
    }
    /**
     * Compare the input sequence and cachedToken, then return the part that is not in cache.
     * This function also remove mismatch part in cache (via kvRemove)
     */
    async getNonCachedTokens(seq) {
        const cachedTokens = await this.getCachedToken();
        let nKeep = 0;
        for (; nKeep < Math.min(cachedTokens.length, seq.length); nKeep++) {
            if (cachedTokens[nKeep] !== seq[nKeep]) {
                break;
            }
        }
        const nDiscard = cachedTokens.length - nKeep;
        this.logger().debug(`Cache nKeep=${nKeep} nDiscard=${nDiscard}`);
        await this.kvRemove(nKeep, nDiscard);
        return seq.slice(nKeep, seq.length);
    }
}
//# sourceMappingURL=wllama.js.map