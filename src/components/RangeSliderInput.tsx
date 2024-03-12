import { Component } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import { Col } from "react-bootstrap";
import { NumericFormat } from 'react-number-format';

interface RangeSliderInputProps {
    min: number,
    max: number
    step: number,
    value: number,
    setValue: Function,
    numericValueSuffix: string,
    tooltipLabel: string,
    colSizeSm: number,
    colSizeMd: number
}

export class RangeSliderInput extends Component<RangeSliderInputProps, {}> {

    public static defaultProps = {
        numericValueSuffix: "",
        colSizeSm: 1,
        colSizeMd: 2
    }

    render() {
        return <>
            <Col>
                <RangeSlider
                    value={this.props.value}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    size="sm"
                    tooltipLabel={() =>
                        this.props.tooltipLabel
                    }
                    onChange={(e) => {
                        this.props.setValue(parseInt(e.target.value))
                    }}
                />
            </Col>
            <Col sm={this.props.colSizeSm} md={this.props.colSizeMd}>
                <NumericFormat
                    className='form-control'
                    value={this.props.value}
                    suffix={this.props.numericValueSuffix}
                    allowNegative={false}
                    onChange={(e) => {
                        this.props.setValue(isNaN(parseInt(e.target.value)) ? this.props.value : parseInt(e.target.value))
                    }}
                    onBlur={(e) => {
                        this.props.setValue(isNaN(parseInt(e.target.value)) ? 0 : this.props.value)
                    }}
                />
            </Col>
        </>
    }
}