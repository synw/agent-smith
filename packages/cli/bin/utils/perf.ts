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

    const time = () => _end(false).toString();

    const printTime = () => console.log(_end(false));

    const timeRaw = () => _end(true);

    const _formatDuration = (ms: number) => {
        const seconds = ms / 1000;
        const minutes = seconds / 60;
        if (ms < 1000) return `${ms.toFixed(2)} milliseconds`;
        if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
        return `${minutes.toFixed(1)} minutes ${seconds % 60} seconds`;
    }

    return {
        start,
        time,
        timeRaw,
        printTime,
    }
}

export { usePerfTimer }