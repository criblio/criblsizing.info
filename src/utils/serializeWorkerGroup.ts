
export function serializeWorkerGroup(

    dataVolumeIn: number,
    connectionVolumeIn: number,
    sustainedVolumeIn: string,
    dataVolumeOut: number,

    cpuType: string,
    cpuSpeed: number,
    cpuCount: number,
    cpuAvailability: number,

    enableSPq: boolean,
    durationSPq: number,
    enableSPqCompression: boolean,

    enableDPq: boolean,
    durationDPq: number,
    enableDPqCompression: boolean,

    workerRedundancy: boolean,
    tcpLoadBalancing: boolean,

    processingLoad: string,
    lookupTableSize: number,
) {
    let output = {
        config: {
            data_volume: {
                in: dataVolumeIn,
                inconn: connectionVolumeIn,
                inconnvol: sustainedVolumeIn,
                out: dataVolumeOut
            },
            cpu_info: {
                type: cpuType,
                speed: cpuSpeed,
                count: cpuCount,
                availability: cpuAvailability
            },
            queuing: {
                source: {
                    enable: enableSPq,
                    duration: durationSPq,
                    compression: enableSPqCompression
                },
                destination: {
                    enable: enableDPq,
                    duration: durationDPq,
                    compression: enableDPqCompression
                }
            },
            advanced: {
                workerredundancy: workerRedundancy,
                tcploadbalance: tcpLoadBalancing,
                processload: processingLoad,
                lookupsize: lookupTableSize
            }
        }
    }

    return JSON.stringify(output)
}