'use client'

import React, { useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Slider, SliderValue } from "@nextui-org/slider";
type InputSliderTextBoxProps = {
    label: string
    tooltipText: string
    minValue: number
    maxValue: number
    step: number

    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>
}

export const InputSliderTextBox: React.FC<InputSliderTextBoxProps> = (props: {
    label: string
    tooltipText: string
    minValue: number
    maxValue: number
    step: number

    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>
}) => {
    
    const [inputValue, setInputValue] = React.useState<string>("0");

    const tooltipText = props.tooltipText;
    const minValue = props.minValue;
    const maxValue = props.maxValue;
    const step = props.step;


    const handleChange = (value: SliderValue) => {
        if (isNaN(Number(value))) return;

        if (Number(value) >= minValue && Number(value) <= maxValue) {
            setInputValue(value.toString());
            props.setValue(Number(value))
        } else {
            return;
        }
    };

    useEffect(() => {
        setInputValue(props.value.toString())
    }, [props.value])

    return (
        <Slider
            label={props.label}
            size="sm"
            minValue={props.minValue}
            maxValue={props.maxValue}
            step={props.step}
            showOutline={true}
            color="secondary"
            renderValue={({ children, ...props }) => (
                <output {...props}>
                    <Input
                        type="number"
                        size="sm"
                        aria-label="Inbound data volume value"
                        value={inputValue}
                        min={minValue}
                        max={maxValue}
                        step={step}
                        variant="faded"
                        endContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">{tooltipText}</span>
                            </div>
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const v = e.target.value;
                            handleChange(Number(v));
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter" && !isNaN(Number(inputValue))) {
                                handleChange(Number(inputValue));
                            }
                        }}
                    />
                </output>
            )}
            value={props.value}
            onChange={handleChange}
        />
    )
}