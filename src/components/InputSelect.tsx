'use client'

import React from "react";
import { Select, SelectItem } from "@nextui-org/select";

type InputSelectProps = {
    label: string
    placeholder: string
    options: { key: string, label: string, value: number }[]
    defaultKeyIndex: number

    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}

export const InputSelect: React.FC<InputSelectProps> = (props: {
    label: string
    placeholder: string
    options: { key: string, label: string, value: number }[]
    defaultKeyIndex: number

    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}) => {

    return (
        <Select
            label={props.label}
            placeholder={props.placeholder}
            variant="faded"
            items={props.options}
            defaultSelectedKeys={[props.options[props.defaultKeyIndex].key]}
            value={props.value}
            onChange={(e) => {props.setValue(e.target.value)}}
        >
            {props.options.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                    {option.label}
                </SelectItem>
            ))}

        </Select>
    )
}