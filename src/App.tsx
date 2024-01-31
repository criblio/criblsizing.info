import { useState, useCallback } from 'react';
import { Alert, Container, Col, Form, Row, Table, FormCheck } from "react-bootstrap";

import { MdExposurePlus1 } from "react-icons/md";
import { PiWarning } from "react-icons/pi";
import { NumericFormat } from 'react-number-format';

import { PersistentQueueAccordion } from './components/PersistentQueueAccordion';
import { RangeSliderInput } from "./components/RangeSliderInput";

import { Calculations } from "./utils/sizingCalculations";
import { getQueryStringValue, setQueryStringValue } from "./utils/queryString";
import { pluralize } from "./utils/plural";

import './App.scss'

function useQueryString(key: string, initialValue: any) {
    const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
    const onSetValue = useCallback(
        (newValue: any) => {
            setValue(newValue);
            setQueryStringValue(key, newValue);
        },
        [key]
    );

    return [value, onSetValue];
}

function App() {
    // input parameters

    // data volume
    const [inbound, setInbound] = useQueryString("stream-in_tb", 0);
    const [inboundTcpConns, setInboundTcpConns] = useQueryString("stream-in_conns", 0);
    const [inboundTcpConnEps, setInboundTcpConnEps] = useQueryString("stream-in_conn_eps", '3');
    const [outbound, setOutbound] = useQueryString("stream-out_tb", 0);

    // cpu information
    const [cpuType, setCpuType] = useQueryString('stream-cpu_type', 'x86_64_ht');
    const [vCPU, setvCPU] = useQueryString("stream-vcpu", 4);
    const [speed, setSpeed] = useQueryString("stream-cpu_speed", 3.0);
    const [cpuAvailability, setCpuAvailability] = useQueryString("stream-cpu_availability", -2);

    // source persistent queue
    const [useSourcePersistentQueue, setUseSourcePersistentQueue] = useQueryString("stream-spq_enabled", false)
    const [sPqDurationHrs, setSPqDurationHrs] = useQueryString("stream-spq_duration_hrs", 0)
    const [useSPqCompression, setUseSPqCompression] = useQueryString("stream-spq_compress_enabled", false)

    // destination persistent queue
    const [useDestinationPersistentQueue, setUseDestinationPersistentQueue] = useQueryString("stream-dpq_enabled", false)
    const [dPqDurationHrs, setDPqDurationHrs] = useQueryString("stream-dpq_duration_hrs", 0)
    const [useDPqCompression, setUseDPqCompression] = useQueryString("stream-dpq_compress_enabled", false)

    // advanced options
    const [useLeaderHa, setUseLeaderHa] = useQueryString("cribl-leader_ha", false);
    const [workerRedundancy, setWorkerRedundancy] = useQueryString("stream-worker_redundancy", false);

    const [processingLoad, setProcessingLoad] = useQueryString("stream-processing_load", "average");
    const [lookupSize, setLookupSize] = useQueryString("stream-lookup_mb", 0);

    // Defaults/Constants
    const defaultThroughput: { [key: string]: number } = { 'x86_64': 400, 'x86_64_ht': 200, 'arm': 480 }
    const defaultConnsPerProcessByEps: { [key: string]: number } = { '3': 5000, '33': 500, '100': 150 }
    const processingLoadModifier: { [key: string]: number } = { 'none': 2.0, 'light': 1.25, 'average': 1.0, 'heavy': 0.6 };

    // Labels
    const labelsTcpConnEps: { [key: string]: string } = { '3': '3 events/sec/conn', '33': '33 events/sec/conn', '100': '100 events/sec/conn' }

    // Calculations
    const processThruput = Calculations.processThruput(defaultThroughput[cpuType], speed, processingLoadModifier[processingLoad]);
    const totalThruput = Calculations.totalThruput(inbound, outbound);

    const workerProcessesByThruput = Calculations.workerProcessCountByThruput(totalThruput, processThruput);
    const workerProcessesByConns = Calculations.workerProcessCountByConnections(inboundTcpConns, defaultConnsPerProcessByEps[inboundTcpConnEps]);

    const sPqDiskGbReq = useSourcePersistentQueue === true ? Calculations.persistentQueueDisk(inbound, sPqDurationHrs, useSPqCompression, 500) : 0;
    const dPqDiskGbReq = useDestinationPersistentQueue === true ? Calculations.persistentQueueDisk(outbound, dPqDurationHrs, useDPqCompression, 500) : 0;

    // Use which ever method requires more worker processes (thruput vs conns)
    const workerProcesses = Math.max(...[workerProcessesByThruput, workerProcessesByConns]);
    const workerMemory = vCPU * Calculations.workerProcessMemory(lookupSize)

    const processesPerNode = cpuAvailability < 0 ? vCPU + cpuAvailability : cpuAvailability;
    const requiredWorkerNodes = workerProcesses / processesPerNode >= 1 ? workerProcesses / processesPerNode : 1;

    const sPqDiskGbReqPerWorker = Math.ceil(sPqDiskGbReq / requiredWorkerNodes);
    const dPqDiskGbReqPerWorker = Math.ceil(dPqDiskGbReq / requiredWorkerNodes);

    const envThroughput = (processThruput * processesPerNode * requiredWorkerNodes) / 1024;

    return (
        <Container className={"Primary"}>
            <h2>Cribl Stream Sizing Calculator</h2>
            <p>Sizing is per worker group and for sustained worker loads.</p>
            <Container className={"UserInputs"}>
                <Form>
                    <Form.Group className='card p-4 bg-light' >
                        <h4 className="my-1">Data Volume</h4>
                        <Row className="mt-1">
                            <Col sm={3} md={6}>
                                <Form.Group as={Row}>
                                    <Form.Label>Inbound Data Volume</Form.Label>
                                    <RangeSliderInput
                                        min={0}
                                        max={50}
                                        step={1}
                                        value={inbound}
                                        setValue={setInbound}
                                        numericValueSuffix={" TB"}
                                        tooltipLabel={inbound >= 1 ? `${inbound} TB/Day` : `Less than 1 TB/Day`}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={2} md={4}>
                                <Form.Group as={Row} >
                                    <Form.Label>Inbound TCP Connections</Form.Label>
                                    <RangeSliderInput
                                        min={0}
                                        max={300000}
                                        step={300}
                                        value={inboundTcpConns}
                                        setValue={setInboundTcpConns}
                                        colSizeSm={2}
                                        colSizeMd={4}
                                        tooltipLabel={inboundTcpConns >= 1 ? `${inboundTcpConns} Connections` : `No Inbound TCP Connections`}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={1} md={2}>
                                <Form.Group as={Row} >
                                    <Form.Label className='px-1'>Sustained Volume</Form.Label>
                                    <Form.Control
                                        as="select"
                                        defaultValue={inboundTcpConnEps}
                                        onChange={(e) => {
                                            setInboundTcpConnEps(e.target.value || inboundTcpConnEps);
                                        }}
                                    >
                                        <option value={"3"}>{labelsTcpConnEps["3"]}</option>
                                        <option value={"33"}>{labelsTcpConnEps["33"]}</option>
                                        <option value={"100"}>{labelsTcpConnEps["100"]}</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={12}>
                                <Row>
                                    <Form.Label>Outbound Data Volume</Form.Label>
                                    <RangeSliderInput
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={outbound}
                                        setValue={setOutbound}
                                        numericValueSuffix={" TB"}
                                        tooltipLabel={outbound >= 1 ? `${outbound} TB/Day` : `Less than 1 TB/Day`}
                                    />
                                </Row>

                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className='card p-4 my-3 bg-light' >
                        <h4 className="my-1" >CPU Information</h4>
                        <Row className="mt-1">
                            <Col xs={12} md={3}>
                                <Form.Label>CPU Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue={cpuType}
                                    onChange={(e) => setCpuType(e.target.value || cpuType)}
                                >
                                    <option value={"x86_64_ht"}>x86_64 (hyper-threaded)</option>
                                    <option>x86_64</option>
                                    <option value={"arm"}>ARM</option>
                                </Form.Control>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Label>Total vCPUs per Worker</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue={vCPU}
                                    onChange={(e) => setvCPU(parseInt(e.target.value) || vCPU)}
                                >
                                    <option>4</option>
                                    <option>8</option>
                                    <option>16</option>
                                    <option>32</option>
                                    <option>48</option>
                                    <option>64</option>
                                    <option>96</option>
                                </Form.Control>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Label>CPU Speed</Form.Label>
                                <Form.Control
                                    type="number"
                                    defaultValue={speed}
                                    onChange={(e) => setSpeed(parseFloat(e.target.value) || speed)}
                                    step={0.1}
                                />
                                <Form.Text className="text-muted">CPU Speed in GHz</Form.Text>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Label><a href={"https://docs.cribl.io/stream/scaling/#scale-up"} target={"_blank"} rel={"noreferrer"}>vCPU Availability</a></Form.Label>
                                <Form.Control
                                    type="number"
                                    defaultValue={cpuAvailability}
                                    onChange={(e) => setCpuAvailability(parseInt(e.target.value) || cpuAvailability)}
                                    min={-vCPU + 1}
                                    max={vCPU}
                                />
                                <Form.Text className="text-muted">per Node</Form.Text>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className='card p-4 my-3 bg-light'>
                        <h4 className="my-1">Persistent Queuing</h4>
                        <Row>
                            <PersistentQueueAccordion
                                usePq={useSourcePersistentQueue}
                                setUsePq={setUseSourcePersistentQueue}
                                pqType='source'
                                dataDirection='inbound'
                                pqDowntimeHrs={sPqDurationHrs}
                                setPqDowntimeHrs={setSPqDurationHrs}
                                usePqCompression={useSPqCompression}
                                setUsePqCompression={setUseSPqCompression}
                                volume={inbound}
                            />
                        </Row>
                        <Row>
                            <PersistentQueueAccordion
                                usePq={useDestinationPersistentQueue}
                                setUsePq={setUseDestinationPersistentQueue}
                                pqType="destination"
                                dataDirection="outbound"
                                pqDowntimeHrs={dPqDurationHrs}
                                setPqDowntimeHrs={setDPqDurationHrs}
                                usePqCompression={useDPqCompression}
                                setUsePqCompression={setUseDPqCompression}
                                volume={outbound}
                            />
                        </Row>
                    </Form.Group>
                    <Form.Group className={`card p-4 bg-light`}>
                        <h4 className='my-1'>Advanced Options</h4>
                        <Row>
                            <Col>
                                <Form.Label className='mt-1'>Resiliency Options</Form.Label>
                                <FormCheck>
                                    <FormCheck.Input
                                        type={'checkbox'}
                                        checked={useLeaderHa}
                                        onChange={() => setUseLeaderHa(!useLeaderHa)}
                                    />
                                    <FormCheck.Label className='mt-0'>Leader High Availability</FormCheck.Label>
                                </FormCheck>
                                <FormCheck>
                                    <FormCheck.Input
                                        type={'checkbox'}
                                        checked={workerRedundancy}
                                        onChange={() => setWorkerRedundancy(!workerRedundancy)}
                                    />
                                    <FormCheck.Label className='mt-0'>Worker Redundancy (<MdExposurePlus1 />)</FormCheck.Label>
                                </FormCheck>
                            </Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={12} md={3}>
                                <Form.Label>Processing Load</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue={processingLoad}
                                    onChange={(e) => setProcessingLoad(e.target.value || processingLoad)}
                                >
                                    <option value={"none"}>No Processing (passthru)</option>
                                    <option value={"light"}>Light Processing</option>
                                    <option value={"average"}>Normal Processing</option>
                                    <option value={"heavy"}>Heavy Processing</option>
                                </Form.Control>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Label>Lookup Table(s) Total Size</Form.Label>
                                <NumericFormat
                                    className='form-control'
                                    value={lookupSize}
                                    defaultValue={0}
                                    suffix={" MB"}
                                    onChange={(e) => {
                                        setLookupSize(isNaN(parseInt(e.target.value)) ? lookupSize : parseInt(e.target.value))
                                    }}
                                    onBlur={(e) => {
                                        setLookupSize(isNaN(parseInt(e.target.value)) ? 0 : lookupSize)
                                    }}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Container>
            <hr />
            {processingLoad === "heavy" ?
                <Alert variant="danger"><PiWarning /> For complex use cases, please contact Cribl Professional Services.</Alert>
                : null
            }
            <Container className={"CalculationOutputs"}>
                <Row>
                    <Col xs={12} md={5}>
                        <h3>Calculations</h3>
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td>Environment Throughput</td>
                                    <td>{envThroughput < 1 ? "< 1" : Math.round(envThroughput)} TB/day</td>
                                </tr>
                                <tr>
                                    <td>Processing Throughput per vCPU</td>
                                    <td>{Math.ceil(processThruput)} GB/day</td>
                                </tr>
                                <tr>
                                    <td>Max Inbound TCP Connections per vCPU</td>
                                    <td>{Math.ceil(defaultConnsPerProcessByEps[inboundTcpConnEps])} connections</td>
                                </tr>
                                <tr>
                                    <td>Required Worker Processes by Thruput</td>
                                    <td>{`${Math.ceil(workerProcessesByThruput)} ${pluralize(Math.ceil(workerProcessesByThruput), 'process', 'processes')}`}</td>
                                </tr>
                                <tr>
                                    <td>Required Worker Processes by Inbound Conns</td>
                                    <td>{`${Math.ceil(workerProcessesByConns)} ${pluralize(Math.ceil(workerProcessesByConns), 'process', 'processes')}`}</td>
                                </tr>
                                <tr>
                                    <td>Processes per Worker</td>
                                    <td>{`${Math.ceil(processesPerNode)} ${pluralize(Math.ceil(processesPerNode), 'process', 'processes')}`}</td>
                                </tr>
                                {useSourcePersistentQueue === false ? null : <tr>
                                    <td>Source Persistent Queue Disk</td>
                                    <td>{`${Math.ceil(sPqDiskGbReq)} ${pluralize(Math.ceil(sPqDiskGbReq), 'GB')}`}</td>
                                </tr>}
                                {useDestinationPersistentQueue === false ? null : <tr>
                                    <td>Destination Persistent Queue Disk</td>
                                    <td>{`${Math.ceil(dPqDiskGbReq)} ${pluralize(Math.ceil(dPqDiskGbReq), 'GB')}`}</td>
                                </tr>}
                                <tr>
                                    <td>Required Workers</td>
                                    <td><strong>{`${Math.ceil(requiredWorkerNodes)} ${pluralize(Math.ceil(requiredWorkerNodes), 'worker')}`}</strong></td>
                                </tr>

                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={12} md={{ span: 6, offset: 1 }}>
                        <h3>Analysis</h3>
                        <p>
                            For{" "}
                            {inbound + outbound < 1
                                ? "less than 1 "
                                : inbound + outbound}{" "}
                            TB/day throughput you would need:
                        </p>
                        <ul>
                            <li style={{ fontSize: 18 }}>
                                <strong>
                                    Workers: {Math.ceil(requiredWorkerNodes + (workerRedundancy ? 1 : 0))} {vCPU}-vCPUs,{" "}
                                    {workerMemory} GB RAM
                                    {useSourcePersistentQueue === true ? `, ${sPqDiskGbReqPerWorker} GB Disk (sPQ)` : null}
                                    {useDestinationPersistentQueue === true ? `, ${dPqDiskGbReqPerWorker} GB Disk (dPQ)` : null}
                                    {" "}{pluralize(Math.ceil(requiredWorkerNodes + (workerRedundancy ? 1 : 0)), 'server')}
                                </strong>
                            </li>
                            <li>
                                Leader: {useLeaderHa ? 2 : 1} 8-vCPUs, 8 GB RAM server
                                {useLeaderHa ?
                                    <ul>
                                        <li>Shared Mount: 100GB NFSv4 Volume (<a href={"https://docs.cribl.io/stream/deploy-add-second-leader/#nfs"} target={"_blank"} rel={"noreferrer"}>Requirements</a>)</li>
                                        <li>Load Balancer (<a href={"https://docs.cribl.io/stream/deploy-add-second-leader/#loadbalancers"} target={"_blank"} rel={"noreferrer"}>Requirements</a>)</li>
                                    </ul>
                                    : null}
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default App;
