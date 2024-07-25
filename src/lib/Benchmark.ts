
export class Benchmark {

    private startTime = 0
    private endTime = 0

    start() {
        this.startTime = new Date().getTime()
        return this
    }

    end() {
        this.endTime = new Date().getTime()
        return this
    }

    getSeconds() {
        return (this.endTime - this.startTime) / 1000
    }
}
