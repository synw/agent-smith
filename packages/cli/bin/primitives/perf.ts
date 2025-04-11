const usePerfTimer = (startTimer = true) => {
    let _startTime: number;
    if (startTimer) {
        _startTime = performance.now()
    }

    const start = () => _startTime = performance.now();

    const _end = (raw: boolean) => {
        if (!_startTime) {
            throw new Error("the timer has not started, can not end it")
        }
        const endTime = performance.now();
        const duration = endTime - _startTime;
        if (raw) {
            return duration
        }
        const humanizedTime = _formatDuration(duration);
        return humanizedTime
    }

    const time = () => _end(false);

    const printTime = () => console.log(_end(false));

    const timeRaw = () => _end(true);

    const _formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        if (ms < 1000) return `${ms.toFixed(2)}ms`;
        if (seconds < 60) return `${seconds.toFixed(2)}s`;
        return `${minutes}m ${seconds % 60}s`;
    }

    return {
        start,
        time,
        timeRaw,
        printTime,
    }
}

export { usePerfTimer }