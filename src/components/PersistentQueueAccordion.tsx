import { Component } from "react";
import { Accordion, Alert, Col, Form, Row } from "react-bootstrap";
import { PiWarning } from "react-icons/pi";
import RangeSlider from "react-bootstrap-range-slider";
import { capitalizeFirstLetter } from "../utils/capitalize";

interface PersistentQueueAccordionProps {
    usePq: string,
    setUsePq: Function,

    pqType: string,
    dataDirection: string,

    pqDowntimeHrs: number,
    setPqDowntimeHrs: Function,

    usePqCompression: string,
    setUsePqCompression: Function,
    volume: number
}

export class PersistentQueueAccordion extends Component<PersistentQueueAccordionProps, {}> {
    render() {
        return <Accordion defaultActiveKey={this.props.usePq === "true" ? "0" : "-1"}>
            <Accordion.Item eventKey="0">
                <Accordion.Header
                    onClick={(e) => this.props.setUsePq(this.props.usePq === "true" ? "false" : "true")}
                >
                    <Form.Check
                        type="switch"
                        id={`${this.props.pqType}-enabled-switch`}
                        checked={this.props.usePq === "true"}
                        onChange={(e) => this.props.setUsePq(e.target.checked === true ? "true" : "false")}
                    />Use {capitalizeFirstLetter(this.props.pqType)} Persistent Queuing
                </Accordion.Header>
                <Accordion.Body>
                    <Row>
                        {(this.props.usePq === "true" && this.props.volume === 0) ?
                            <Alert variant={"warning"}>
                                <PiWarning /> {capitalizeFirstLetter(this.props.dataDirection)} volume is set to less than 1 TB/day, assuming 500 GB/day for destination persistent queuing calculations.
                            </Alert>
                            : ""}
                        <Col sm={11}>
                            <Form.Label>Queuing Duration</Form.Label>
                            <RangeSlider
                                value={this.props.pqDowntimeHrs}
                                min={0}
                                max={168}
                                step={(() => {
                                    switch (this.props.pqDowntimeHrs < 24) {
                                        case true: return 1;
                                        case false: return 24;
                                    }
                                })()}
                                size="sm"
                                tooltipLabel={(e) =>
                                    e < 24 ? `${e} Hour${e !== 1 ? "s" : ''}` : `${e / 24} Days`
                                }
                                onChange={(e) => {
                                    this.props.setPqDowntimeHrs(e.target.value === "0" ? 0 : parseInt(e.target.value) || this.props.pqDowntimeHrs);
                                }}
                            />
                        </Col>
                        <br />
                        <Col sm={1}>
                            <Form.Label>PQ Compression</Form.Label>
                            <Form.Check
                                type="switch"
                                id={`${this.props.pqType}-compression-switch`}
                                checked={this.props.usePqCompression === "true"}
                                onChange={(e) => this.props.setUsePqCompression(e.target.checked === true ? "true" : "false")}
                            />
                        </Col>
                    </Row>
                    <br />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    }
}