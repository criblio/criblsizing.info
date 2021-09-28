import React, {useState} from 'react';
import './App.scss'
import {Container, Col, Form, Row, Table} from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

function App() {
    const [inbound, setInbound] = useState(0);
    const [outbound, setOutbound] = useState(0);
    const [vCPU, setvCPU] = useState(4);
    const [speed, setSpeed] = useState(3.0);
    const [cpuAvailability, setCpuAvailability] = useState(-2);
    const [totalThroughput,] = useState(400);
    const ptp = ((totalThroughput / 2) * speed) / 3;
    // const inOut = outbound + inbound;
    const workerProcesses = ((outbound + inbound) * 1024) / ptp || 4;

    const processesPerNode =
        cpuAvailability < 0
            ? vCPU + cpuAvailability
            : cpuAvailability;

    const requiredWorkerNodes =
        workerProcesses / processesPerNode >= 2
            ? workerProcesses / processesPerNode
            : 2;

    const envThroughput = (ptp * processesPerNode * requiredWorkerNodes) / 1024;

    return (
        <Container className={"UserInputs"}>
            <Row>
                <Col>
                    <Form.Label>Inbound Data Volume</Form.Label>
                    <RangeSlider
                        data-testid={"inbound"}
                        value={inbound}
                        min={0}
                        max={100}
                        step={1}
                        size="lg"
                        tooltipLabel={(e) =>
                            e >= 1 ? `${e} TB/Day` : `Less than 1 TB/Day`
                        }
                        onChange={(e) => {
                            setInbound(e.target.value === "0" ? 0 : parseInt(e.target.value) || outbound);
                        }}
                    />
                </Col>

                <Col>
                    <Form.Label>Outbound Data Volume</Form.Label>
                    <RangeSlider
                        value={outbound}
                        min={0}
                        max={100}
                        step={1}
                        size="lg"
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
                <Col xs={12} md={4}>
                    <Form.Label>Total vCPUs per Node</Form.Label>

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
                <Col xs={12} md={4}>
                    <Form.Label>CPU Speed</Form.Label>
                    <Form.Control
                        type="number"
                        defaultValue={speed}
                        data-testid={"cpu-speed"}
                        onChange={(e) => setSpeed(parseFloat(e.target.value) || speed)}
                    />
                    <Form.Text className="text-muted">CPU Speed in GHz</Form.Text>
                </Col>
                <Col xs={12} md={4}>
                    <Form.Label><a href={"https://docs.cribl.io/docs/scaling#scale-up"}>vCPU Availability</a></Form.Label>
                    <Form.Control
                        type="number"
                        defaultValue={cpuAvailability}
                        onChange={(e) => setCpuAvailability(parseInt(e.target.value) || cpuAvailability)}
                    />
                    <Form.Text className="text-muted">per Node</Form.Text>
                </Col>
            </Row>

            <Row style={{marginTop: 50}}>
                <Col xs={12} md={5}>
                    <h3>Calculations</h3>
                    <Table striped bordered hover>
                        <tbody>
                        <tr>
                            <td>Processing Throughput per vCPU</td>
                            <td>{Math.round(ptp)} GB/day</td>
                        </tr>
                        <tr>
                            <td>Worker Processes</td>
                            <td>{Math.round(workerProcesses)} processes</td>
                        </tr>
                        <tr>
                            <td>Processes per Worker Node</td>
                            <td>{Math.round(processesPerNode)} processes</td>
                        </tr>
                        <tr>
                            <td>Required Worker Nodes</td>
                            <td>{Math.round(requiredWorkerNodes)} workers</td>
                        </tr>
                        <tr>
                            <td>Environment Throughput</td>
                            <td>{Math.round(envThroughput)} TB/day</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col xs={12} md={{span: 6, offset: 1}}>
                    <h3>Analysis</h3>
                    <p>
                        For{" "}
                        {inbound + outbound < 1
                            ? "less than 1 "
                            : inbound + outbound}{" "}
                        TB/day throughput you would need:
                    </p>
                    <ul>
                        <li style={{fontSize: 18}}>
                            <strong>
                                Worker node(s): {Math.round(requiredWorkerNodes)} {vCPU}-vCPUs{" "}
                                {Math.round(vCPU * 2)} GB server(s)
                            </strong>
                        </li>
                        <li>Master Node: 1 8-vCPUs, 8 GB server</li>

                        <li>Optional: An additional worker node, for HA</li>
                    </ul>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
