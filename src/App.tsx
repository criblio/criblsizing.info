import React, { useState, useCallback } from 'react';
import './App.scss'
import { ButtonGroup, Container, Col, Dropdown, DropdownButton, Form, Row, Table } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { getQueryStringValue, setQueryStringValue } from "./utils/queryString";
import { pluralize } from "./utils/plural";

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
    // Input parameters
    const [inbound, setInbound] = useQueryString("in", 0);
    const [inboundTcpConns, setInboundTcpConns] = useQueryString("inconns", 0);
    const [inboundTcpConnEps, setInboundTcpConnEps] = useQueryString("inconneps", '3');
    const [outbound, setOutbound] = useQueryString("out", 0);
    const [cpuType, setCpuType] = useQueryString('cputype', 'x86_64_ht');
    const [vCPU, setvCPU] = useQueryString("vcpu", 4);
    const [speed, setSpeed] = useQueryString("cpuspeed", 3.0);
    const [cpuAvailability, setCpuAvailability] = useQueryString("cpuavailable", -2);

    // Defaults/Constants
    const defaultThroughput: { [key: string]: number } = { 'x86_64': 400, 'x86_64_ht': 200, 'arm': 480 }
    const defaultConnsPerProcessByEps: { [key: string]: number } = { '3': 5000, '33': 500, '100': 150 }

    // Labels
    const labelsTcpConnEps: { [key: string]: string } = { '3': '3 events/sec/conn', '33': '33 events/sec/conn', '100': '100 events/sec/conn' }

    // Calculations
    const processThruput = (defaultThroughput[cpuType] * speed) / 3;
    const inOut = outbound + inbound;

    const workerProcessesByThruput = (inOut * 1024) / processThruput || 4;
    const workerProcessesByConns = inboundTcpConns / defaultConnsPerProcessByEps[inboundTcpConnEps];

    // Use which ever method requires more worker processes (thruput vs conns)
    const workerProcesses = Math.max(...[workerProcessesByThruput, workerProcessesByConns]);

    const processesPerNode =
        cpuAvailability < 0
            ? vCPU + cpuAvailability
            : cpuAvailability;

    const requiredWorkerNodes =
        workerProcesses / processesPerNode >= 1
            ? workerProcesses / processesPerNode
            : 1;

    const envThroughput = (processThruput * processesPerNode * requiredWorkerNodes) / 1024;

    return (
        <Container className={"Primary"}>
            <h2>Cribl Stream Sizing Calculator</h2>
            <p>Sizing is per worker group and for sustained worker loads.</p>
            <Container className={"UserInputs"}>
                <Row>
                    <Col sm={3} md={6}>
                        <Form.Label>Inbound Data Volume</Form.Label>
                        <RangeSlider
                            data-testid={"inbound"}
                            value={inbound}
                            min={0}
                            max={1000}
                            step={1}
                            size="sm"
                            tooltipLabel={(e) =>
                                e >= 1 ? `${e} TB/Day` : `Less than 1 TB/Day`
                            }
                            onChange={(e) => {
                                setInbound(e.target.value === "0" ? 0 : parseInt(e.target.value) || inbound);
                            }}
                        />
                    </Col>

                    <Col sm={2} md={4}>
                        <Form.Label>Inbound TCP Connections</Form.Label>
                        <RangeSlider
                            data-testid={"inbound-tcp-conn"}
                            value={inboundTcpConns}
                            min={0}
                            max={300000}
                            step={300}
                            size="sm"
                            tooltipLabel={(e) =>
                                e >= 1 ? `${e} Connections` : `No Inbound TCP Connections`
                            }
                            onChange={(e) => {
                                setInboundTcpConns(e.target.value === "0" ? 0 : parseInt(e.target.value) || inboundTcpConns);
                            }}
                        />
                    </Col>
                    <Col sm={1} md={2}>
                        <Form.Label>Sustained Volume</Form.Label>
                        <br />
                        <DropdownButton
                            as={ButtonGroup}
                            title={labelsTcpConnEps[inboundTcpConnEps]}
                            id="bg-nested-dropdown"
                            onSelect={(e) => {
                                setInboundTcpConnEps(e || inboundTcpConnEps);
                            }}
                            variant='outline-secondary'
                        >
                            <Dropdown.Item eventKey="3">3 events/sec/conn</Dropdown.Item>
                            <Dropdown.Item eventKey="33">33 events/sec/conn</Dropdown.Item>
                            <Dropdown.Item eventKey="100">100 events/sec/conn</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Form.Label>Outbound Data Volume</Form.Label>
                        <RangeSlider
                            data-testid={"outbound"}
                            value={outbound}
                            min={0}
                            max={1000}
                            step={1}
                            size="sm"
                            tooltipLabel={(e) =>
                                e >= 1 ? `${e} TB/Day` : `Less than 1 TB/Day`
                            }
                            onChange={(e) => {
                                setOutbound(e.target.value === "0" ? 0 : parseInt(e.target.value) || outbound);
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={3}>
                        <Form.Label>CPU Type</Form.Label>

                        <Form.Control
                            as="select"
                            defaultValue={cpuType}
                            onChange={(e) => setCpuType(e.target.value || cpuType)}
                        >
                            <option value={"x86_64_ht"}>x86_64 (Hyperthreaded)</option>
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
                            data-testid={"cpu-speed"}
                            onChange={(e) => setSpeed(parseFloat(e.target.value) || speed)}
                            step={0.1}
                        />
                        <Form.Text className="text-muted">CPU Speed in GHz</Form.Text>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Label><a href={"https://docs.cribl.io/stream/scaling/#scale-up"} target={"_blank"} rel={"noreferrer"}>vCPU Availability</a></Form.Label>
                        <Form.Control
                            data-testid={"cpu-availability"}
                            type="number"
                            defaultValue={cpuAvailability}
                            onChange={(e) => setCpuAvailability(parseInt(e.target.value) || cpuAvailability)}
                            min={-vCPU + 1}
                            max={vCPU}
                        />
                        <Form.Text className="text-muted">per Node</Form.Text>
                    </Col>
                </Row>
            </Container>
            <hr />
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
                                    Workers: {Math.ceil((requiredWorkerNodes === 1 ? 2 : requiredWorkerNodes))} {vCPU}-vCPUs,{" "}
                                    {Math.ceil(vCPU * 2)} GB RAM {pluralize(Math.ceil(requiredWorkerNodes), 'server')}
                                </strong>{requiredWorkerNodes === 1 ? <small> <i>(Addtl. worker added for redundency)</i></small> : ""}
                            </li>
                            <li>Leader: 1 8-vCPUs, 8 GB RAM server</li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </Container>

    );
}

export default App;
