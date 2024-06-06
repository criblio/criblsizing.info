'use client'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

import { InputSelect } from "@/components/InputSelect";
import { InputSliderTextBox } from "@/components/InputSliderTextBox";
import { InputNumber } from "@/components/InputNumber";
import { QueuingAccordion } from "@/components/QueuingAccordion";
import { useState } from "react";
import { Calculations, totalThruput } from "@/utils/sizingCalculations";
import { CriblWorkerGroupAdvOptions } from "@/components/stream/CriblWorkerGroupAdvOptions";

import { parseAsBoolean, parseAsFloat, parseAsInteger, parseAsString, useQueryState } from 'nuqs'

type CriblWorkerGroupProps = {
    name: string

    workerGroupConfigs: Map<string, string>
    setWorkerGroupConfigs: React.Dispatch<React.SetStateAction<Map<string, string>>>
}

export const CriblWorkerGroup: React.FC<CriblWorkerGroupProps> = (props: {
    name: string

    workerGroupConfigs: Map<string, string>
    setWorkerGroupConfigs: React.Dispatch<React.SetStateAction<Map<string, string>>>
}) => {

    const optionsInboundSustainedVolume = [
        { key: "3epsc", label: "3 events/sec/conn", value: 5000 },
        { key: "33epsc", label: "33 events/sec/conn", value: 500 },
        { key: "100epcs", label: "100 events/sec/conn", value: 150 }
    ];
    const optionsCpuType = [
        { key: "x86-64ht", label: "x86_64 (Hyperthreaded)", value: 200 },
        { key: "x86-64", label: "x86_64", value: 400 },
        { key: "arm", label: "ARM", value: 450 }
    ];
    const optionsProcessingLoad = [
        { key: "none", label: "No Processing (passthru)", value: 2 },
        { key: "light", label: "Light Processing", value: 1.25 },
        { key: "normal", label: "Normal Processing", value: 1 },
        { key: "heavy", label: "Heavy Processing", value: 0.6 }
    ];

    const [dataVolumeIn, setDataVolumeIn] = useQueryState("stream-in_tb", parseAsInteger.withDefault(0));
    const [connectionVolumeIn, setConnectionVolumeIn] = useQueryState("stream-in_conns", parseAsInteger.withDefault(0));
    const [sustainedVolumeIn, setSustainedVolumeIn] = useQueryState("stream-in_conn_eps", parseAsString.withDefault("3epsc"));
    const [dataVolumeOut, setDataVolumeOut] = useQueryState("stream-out_tb", parseAsInteger.withDefault(0));

    const [cpuType, setCpuType] = useQueryState("stream-cpu_type", parseAsString.withDefault("x86-64ht"));
    const [cpuCount, setCpuCount] = useQueryState("stream-cpu_count", parseAsInteger.withDefault(0));
    const [cpuSpeed, setCpuSpeed] = useQueryState("stream-cpu_speed", parseAsFloat.withDefault(3.0));
    const [cpuAvailability, setCpuAvailability] = useQueryState("stream-cpu_availability", parseAsInteger.withDefault(-2));

    const [enableSPq, setEnableSPq] = useQueryState("stream-spq_enabled", parseAsBoolean.withDefault(false));
    const [durationSPq, setDurationSPq] = useQueryState("stream-spq_duration_hrs", parseAsInteger.withDefault(0));
    const [enableSPqCompression, setEnableSPqCompression] = useQueryState("stream-spq_compress_enabled", parseAsBoolean.withDefault(false));

    const [enableDPq, setEnableDPq] = useQueryState("stream-dpq_enabled", parseAsBoolean.withDefault(false));
    const [durationDPq, setDurationDPq] = useQueryState("stream-dpq_duration_hrs", parseAsInteger.withDefault(0));
    const [enableDPqCompression, setEnableDPqCompression] = useQueryState("stream-dpq_compress_enabled", parseAsBoolean.withDefault(false));

    const [workerRedundancy, setWorkerRedundency] = useQueryState("stream-worker_redundency", parseAsBoolean.withDefault(true));
    const [tcpLoadBalancing, setTcpLoadBalancing] = useQueryState("stream-tcp_loadbalancing", parseAsBoolean.withDefault(false));

    const [processingLoad, setProcessingLoad] = useQueryState("stream-processing_load", parseAsString.withDefault("normal"));
    const [lookupTableSize, setLookupTableSize] = useQueryState("stream-lookup_mb", parseAsInteger.withDefault(0));

    const workerGroupThruput = Calculations.totalThruput(dataVolumeIn, dataVolumeOut);
    const processThruput = Calculations.processThruput(
        (optionsCpuType.find((x) => x.key === cpuType) || optionsCpuType[0]).value,
        cpuSpeed,
        (optionsProcessingLoad.find((x) => x.key === processingLoad) || optionsProcessingLoad[0]).value
    )

    const workerProcessCountByThruput = Calculations.workerProcessCountByThruput(workerGroupThruput, processThruput)
    const workerProcessCountByConnections = Calculations.workerProcessCountByConnections(connectionVolumeIn, (optionsInboundSustainedVolume.find((x) => x.key === sustainedVolumeIn) || optionsInboundSustainedVolume[0]).value)

    const sPqDiskGbReq = enableSPq === true ? Calculations.persistentQueueDisk(dataVolumeIn, durationSPq, enableSPqCompression, 500) : 0;
    const dPqDiskGbReq = enableDPq === true ? Calculations.persistentQueueDisk(dataVolumeOut, durationDPq, enableDPqCompression, 500) : 0;

    // Use which ever method requires more worker processes (thruput vs conns)
    const workerProcesses = Math.max(...[workerProcessCountByThruput, workerProcessCountByConnections]);
    const workerMemory = cpuCount * Calculations.workerProcessMemory(lookupTableSize)

    const processesPerNode = (cpuAvailability < 0 ? cpuCount + cpuAvailability : cpuAvailability) - (tcpLoadBalancing ? 1 : 0);
    const requiredWorkerNodes = (workerProcesses / processesPerNode >= 1 ? workerProcesses / processesPerNode : 1);

    const sPqDiskGbReqPerWorker = Math.ceil(sPqDiskGbReq / requiredWorkerNodes);
    const dPqDiskGbReqPerWorker = Math.ceil(dPqDiskGbReq / requiredWorkerNodes);

    return (
        <>
            <div className="bg-white">
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <h2>
                            Data Volume
                        </h2>
                    </div>
                    <div className="grid grid-cols-4 gap-4 py-4">
                        <div className="col-span-2">
                            <InputSliderTextBox label="Inbound Data Volume" tooltipText="TB/day" minValue={0} maxValue={50} step={0.5} value={dataVolumeIn} setValue={setDataVolumeIn} />
                        </div>
                        <div className="col-span-2">
                            <InputSliderTextBox label="Inbound TCP Connections" tooltipText="connections" minValue={0} maxValue={300000} step={300} value={connectionVolumeIn} setValue={setConnectionVolumeIn} />
                        </div>
                    </div>
                    <div className="py-4">
                        <InputSelect label="Inbound Sustained Volume" placeholder="Sustained Volume" defaultKeyIndex={0} options={optionsInboundSustainedVolume} value={sustainedVolumeIn} setValue={setSustainedVolumeIn} />
                    </div>
                    <div className="mt-4">
                        <InputSliderTextBox label="Outbound Data Volume" tooltipText="TB/day" minValue={0} maxValue={50} step={1} value={dataVolumeOut} setValue={setDataVolumeOut} />
                    </div>
                </div>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <h2>
                            CPU Information
                        </h2>
                    </div>
                    <div className="columns-4">
                        <div>
                            <InputSelect label="CPU Type" placeholder="CPU Type" defaultKeyIndex={0} options={optionsCpuType} value={cpuType} setValue={setCpuType} />
                        </div>
                        <div>
                            <InputNumber label="Total vCPUs per Worker" defaultValue={4} minValue={2} maxValue={96} step={1} value={cpuCount} setValue={setCpuCount} />
                        </div>
                        <div>
                            <InputNumber
                                label="CPU Speed (GHz)"
                                defaultValue={3.0}
                                minValue={0.1}
                                maxValue={16}
                                step={0.1}
                                value={cpuSpeed}
                                setValue={setCpuSpeed}
                            />
                        </div>
                        <div>
                            <InputNumber
                                label="vCPU Availability (per node)"
                                defaultValue={-2}
                                minValue={-12}
                                maxValue={0}
                                step={1}
                                value={cpuAvailability}
                                setValue={setCpuAvailability}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <h2>
                            Persistent Queuing
                        </h2>
                        <div className="pt-4">
                            <QueuingAccordion
                                enableSPq={enableSPq} setEnableSPq={setEnableSPq}
                                durationSPq={durationSPq} setDurationSPq={setDurationSPq}
                                enableSPqCompression={enableSPqCompression} setEnableSPqCompression={setEnableSPqCompression}
                                enableDPq={enableDPq} setEnableDPq={setEnableDPq}
                                durationDPq={durationDPq} setDurationDPq={setDurationDPq}
                                enableDPqCompression={enableDPqCompression} setEnableDPqCompression={setEnableDPqCompression}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <h2>
                            Worker Group Advanced Options
                        </h2>
                    </div>
                    <div>
                        <CriblWorkerGroupAdvOptions
                            workerRedundency={workerRedundancy} setWorkerRedundency={setWorkerRedundency}
                            tcpLoadBalancing={tcpLoadBalancing} setTcpLoadBalancing={setTcpLoadBalancing}
                        />
                    </div>
                    <div className="columns-2 mt-4">
                        <div>
                            <InputSelect label="Processing Load" placeholder="Processing Load" defaultKeyIndex={2} options={optionsProcessingLoad} value={processingLoad} setValue={setProcessingLoad} />
                        </div>
                        <div>
                            <InputNumber
                                label="Lookup Table(s) Total Size"
                                defaultValue={0}
                                minValue={0}
                                maxValue={2048}
                                step={10}
                                value={lookupTableSize}
                                setValue={setLookupTableSize}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">MB</span>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="m-4 p-4 columns-2 gap-6">
                    <Table hideHeader isStriped aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>CALCULATION</TableColumn>
                            <TableColumn>VALUE</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="workerGroupThruput">
                                <TableCell>Worker Group Thruput</TableCell>
                                <TableCell>{`${workerGroupThruput} TB/day`}</TableCell>
                            </TableRow>
                            <TableRow key="processingThruputPerVcpu">
                                <TableCell>Processing Thruput per vCPU</TableCell>
                                <TableCell>{`${Math.round(processThruput)} GB/day`}</TableCell>
                            </TableRow>
                            <TableRow key="maxInboundTcpConnectionsPerVcpu">
                                <TableCell>Max Inbound TCP Connections per vCPU</TableCell>
                                <TableCell>{`${(optionsInboundSustainedVolume.find((x) => x.key === sustainedVolumeIn) || optionsInboundSustainedVolume[0]).value} connections`}</TableCell>
                            </TableRow>
                            <TableRow key="requiredWorkerProcessesByThruput">
                                <TableCell>Required Worker Processes by Thruput</TableCell>
                                <TableCell>{`${Math.round(workerProcessCountByThruput)} processes`}</TableCell>
                            </TableRow>
                            <TableRow key="requiredWorkerProcessesByInboundConns">
                                <TableCell>Required Worker Processes by Inbound Conns</TableCell>
                                <TableCell>{`${Math.ceil(workerProcessCountByConnections)} processes`}</TableCell>
                            </TableRow>
                            <TableRow key="processesPerWorker">
                                <TableCell>Processes per Worker</TableCell>
                                <TableCell>{`${processesPerNode} processes`}</TableCell>
                            </TableRow>
                            <TableRow key="sourcePersistentQueueDisk">
                                <TableCell>Source Persistent Queue Disk</TableCell>
                                <TableCell>{`${sPqDiskGbReq} GBs`}</TableCell>
                            </TableRow>
                            <TableRow key="destinationPersistentQueueDisk">
                                <TableCell>Destination Persistent Queue Disk</TableCell>
                                <TableCell>{`${dPqDiskGbReq} GBs`}</TableCell>
                            </TableRow>
                            <TableRow key="requiredWorkers">
                                <TableCell>Required Workers</TableCell>
                                <TableCell className="font-bold">{`${Math.ceil(requiredWorkerNodes)} worker(s)`}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div>
                        <div className="text-2xl">
                            <h3 className="text-md font-medium">Worker Group Analysis</h3>
                        </div>
                        <p>
                            For{" "} {workerGroupThruput < 1 ? "less than 1 " : workerGroupThruput}{" "} TB/day throughput you would need:
                        </p>
                        <ul>
                            <li style={{ fontSize: 18 }}>
                                <strong>
                                    Workers: {Math.ceil(requiredWorkerNodes + (workerRedundancy ? 1 : 0))} {cpuCount}-vCPUs,{" "}
                                    {Math.ceil(workerMemory)} GB RAM
                                    {enableSPq === true ? `, ${sPqDiskGbReqPerWorker} GB Disk (sPQ)` : null}
                                    {enableDPq === true ? `, ${dPqDiskGbReqPerWorker} GB Disk (dPQ)` : null}
                                    {" server(s) "}
                                </strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </div >
        </>
    )
}