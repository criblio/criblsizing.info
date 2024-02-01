
/**
 * calculates thruput as gb/day for a single worker process
 * @param defaultThruput default thruput for cpu type
 * @param cpuSpeed clock speed of cpu
 * @param loadModifier multiplier to modify thruput based on processing overhead
 * @returns number as gb/day of thruput per worker process
 */
export function processThruput(defaultThruput: number, cpuSpeed:number, loadModifier: number): number {
    return ((defaultThruput * cpuSpeed) / 3) * loadModifier;
}

/**
 * calculates total thruput for worker group
 * @param inboundVolume inbound volume for worker group as tb
 * @param outboundVolume outbound volume for worker group as tb
 * @returns total thruput (in & out) as tb for worker group
 */
export function totalThruput(inboundVolume: number, outboundVolume:number): number {
    return inboundVolume + outboundVolume;
}

/**
 * calculates required worker processes with only regards to thruput
 * @param totalThruput thruput required as tb
 * @param processThruput thruput as gb/day per worker process
 * @returns number of required worker processes to handle thruput
 */
export function workerProcessCountByThruput(totalThruput: number, processThruput: number): number {
    return (totalThruput * 1024) / processThruput;
}

/**
 * calculates required worker processes with only regards to connection counts
 * @param inTcpConnections number of inbound tcp connections for worker group
 * @param processConnectionCount number of connections a single worker process can handle
 * @returns number of required worker processes to handle connection count
 */
export function workerProcessCountByConnections(inTcpConnections: number, processConnectionCount: number): number {
    return inTcpConnections / processConnectionCount;
}

/**
 * calculates the required amount of disk in gb for persistent queuing
 * @param volume inbound volume as tb
 * @param durationHours time in hours persistent queue should have capacity to hold data
 * @param compression is persistent queue compression enabled
 * @param minimumVolume minimum inbound volume as gb
 * @param compressionRatio compression ratio for persistent queue compression, defaults at 8 to 1 (0.125)
 * @returns disk capacity required as gb for persistent queue
 */
export function persistentQueueDisk(volume: number, durationHours: number, compression: boolean, minimumVolume: number = 0, compressionRatio: number = 0.125): number {
    return Math.max(...[volume * 1000, minimumVolume]) * durationHours * (compression === true ? compressionRatio : 1)
}

/**
 * calculate the required memory per worker process
 * @param lookupSize total size of lookup files in mb
 * @param baseMemory memory required in gb for worker processes without other factors
 * @returns required memory for each worker process in gb
 */
export function workerProcessMemory(lookupSize: number = 0, baseMemory: number = 2): number {
    return baseMemory + (Math.round(lookupSize * 2.50) / 1000)
}

export * as Calculations from './sizingCalculations'