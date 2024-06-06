'use client'

import React, { ReactNode, useState } from "react";
import { Input } from "@nextui-org/input";

type InputNumberProps = {
    label: string
    defaultValue: number
    minValue: number
    maxValue: number
    step: number

    endContent?: ReactNode | null

    value: number
    setValue: React.Dispatch<React.SetStateAction<number>>
}

export const InputNumber: React.FC<InputNumberProps> = (props: {
    label: string
    defaultValue: number
    minValue: number
    maxValue: number
    step: number

    endContent?: ReactNode | null

    value: number
    setValue: React.Dispatch<React.SetStateAction<number>>
}) => {

    return (
        <Input
            type="number"
            label={props.label}
            labelPlacement="inside"
            variant="faded"
            defaultValue={props.defaultValue.toString()}
            min={props.minValue}
            max={props.maxValue}
            step={props.step}
            value={props.value?.toString()}
            onChange={(e) => props.setValue(Number(e.target.value))}
            endContent={props.endContent ? props.endContent : <></>}
        />
    )
}