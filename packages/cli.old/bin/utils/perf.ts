const usePerfTimer = (startTimer = true) => {
    let startTime: number;
    const measurements: { name: string; time: number; percentage: number }[] = [];
    let lastTime: number;
    if (startTimer) {
        startTime = performance.now();
        lastTime = startTime;
    }

    const measure = (name: string) => {
        const currentTime = performance.now();
        const elapsedNs = Number(currentTime - lastTime);
        const elapsedSec = elapsedNs / 1000;
        measurements.push({ name, time: elapsedSec, percentage: 0 });
        lastTime = currentTime;
        console.log(name, elapsedSec)
    }

    const final = (name = "") => {
        const totalTime = Number(performance.now() - startTime) / 1000;
        console.log("\n*** Performance", name.length > 0 ? `for ${name}` : "", " ***");
        measurements.forEach(m => {
            m.percentage = (m.time / totalTime) * 100;
            console.log(` - ${m.name}: ${m.time.toFixed(6)}s (${m.percentage.toFixed(2)}%)`);
        });
        console.log(`Total time: ${totalTime.toFixed(6)}s\n`);
    };

    const start = () => {
        startTime = performance.now();
        lastTime = startTime;
    };

    const _end = (raw: boolean) => {
        if (!startTime) {
            throw new Error("the timer has not started, can not end it")
        }
        const endTime = performance.now();
        const duration = endTime - startTime;
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
        return `${minutes.toFixed()} minutes ${(seconds % 60).toFixed()} seconds`;
    }

    return {
        start,
        time,
        timeRaw,
        printTime,
        measure,
        final,
    }
}

export { usePerfTimer }