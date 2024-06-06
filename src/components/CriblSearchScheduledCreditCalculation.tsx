'use client'
import { Input } from "@nextui-org/input";
import { InputNumber } from "./InputNumber";
import { useEffect, useState } from "react";
import { updateArrayAndReturn } from "@/utils/arrays";

type CriblSearchScheduledCreditCalculationProps = {
    index: number
    loading: boolean

    allDescription: string[]
    setAllDescription: React.Dispatch<React.SetStateAction<string[]>>

    allCreditsPerSearch: number[]
    setAllCreditsPerSearch: React.Dispatch<React.SetStateAction<number[]>>

    allDailySearches: number[]
    setAllDailySearches: React.Dispatch<React.SetStateAction<number[]>>

    allDaysScheduled: number[]
    setAllDaysScheduled: React.Dispatch<React.SetStateAction<number[]>>
}

export const CriblSearchScheduledCreditCalculation: React.FC<CriblSearchScheduledCreditCalculationProps> = (props: {
    index: number
    loading: boolean

    allDescription: string[]
    setAllDescription: React.Dispatch<React.SetStateAction<string[]>>

    allCreditsPerSearch: number[]
    setAllCreditsPerSearch: React.Dispatch<React.SetStateAction<number[]>>
    allDailySearches: number[]
    setAllDailySearches: React.Dispatch<React.SetStateAction<number[]>>

    allDaysScheduled: number[]
    setAllDaysScheduled: React.Dispatch<React.SetStateAction<number[]>>
}) => {

    const [description, setDescription] = useState<string>("");
    const [creditsPerSearch, setCreditsPerSearch] = useState<number>(0);
    const [dailySearches, setDailySearches] = useState<number>(0);
    const [daysScheduled, setDaysScheduled] = useState<number>(0);

    useEffect(() => {
        if (props.loading) { return }
        props.setAllDescription(updateArrayAndReturn(props.allDescription, props.index, description))
    }, [description])
    useEffect(() => {
        if (props.loading) { return }
        props.setAllCreditsPerSearch(updateArrayAndReturn(props.allCreditsPerSearch, props.index, creditsPerSearch))
    }, [creditsPerSearch])
    useEffect(() => {
        if (props.loading) { return }
        props.setAllDailySearches(updateArrayAndReturn(props.allDailySearches, props.index, dailySearches))
    }, [dailySearches])
    useEffect(() => {
        if (props.loading) { return }
        props.setAllDaysScheduled(updateArrayAndReturn(props.allDaysScheduled, props.index, daysScheduled))
    }, [daysScheduled])

    useEffect(() => {
        setDescription(props.allDescription[props.index])
        setCreditsPerSearch(props.allCreditsPerSearch[props.index])
        setDailySearches(props.allDailySearches[props.index])
        setDaysScheduled(props.allDaysScheduled[props.index])
    }, [props.loading])

    return (
        <div className="grid grid-cols-6 gap-4 py-2">
            <div className="grid gap-4 col-span-5">
                <div className="grid grid-cols-subgrid gap-4 col-span-4">
                    <Input type="text" label="Description" value={description} onValueChange={setDescription} />
                    <InputNumber label={"Est. Credits per Search"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={creditsPerSearch} setValue={setCreditsPerSearch} />
                    <InputNumber label={"Daily Searches"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={dailySearches} setValue={setDailySearches} />
                    <InputNumber label={"Days Scheduled Annually"} defaultValue={0} minValue={0} maxValue={365} step={1} value={daysScheduled} setValue={setDaysScheduled} />
                </div>
            </div>
            <div className="grid grid-cols-subgrid gap-4 col-span-1">
                <h5 className="text-sm py-4">Annual Credits: {(creditsPerSearch * dailySearches * daysScheduled).toLocaleString()}</h5>
            </div>
        </div>
    )
}