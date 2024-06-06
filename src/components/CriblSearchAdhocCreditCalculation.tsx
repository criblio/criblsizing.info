'use client'
import { Input } from "@nextui-org/input";
import { InputNumber } from "./InputNumber";
import { useEffect, useState } from "react";
import { updateArrayAndReturn } from "@/utils/arrays";

type CriblAdhocScheduledCreditCalculationProps = {
    index: number
    loading: boolean

    allDescription: string[]
    setAllDescription: React.Dispatch<React.SetStateAction<string[]>>

    allCreditsPerSearch: number[]
    setAllCreditsPerSearch: React.Dispatch<React.SetStateAction<number[]>>

    allSearchesPerSession: number[]
    setAllSearchesPerSession: React.Dispatch<React.SetStateAction<number[]>>

    allWeeklySessions: number[]
    setAllWeeklySessions: React.Dispatch<React.SetStateAction<number[]>>

    allWeeklyUsers: number[]
    setAllWeeklyUsers: React.Dispatch<React.SetStateAction<number[]>>
}

export const CriblSearchAdhocCreditCalculation: React.FC<CriblAdhocScheduledCreditCalculationProps> = (props: {
    index: number
    loading: boolean

    allDescription: string[]
    setAllDescription: React.Dispatch<React.SetStateAction<string[]>>

    allCreditsPerSearch: number[]
    setAllCreditsPerSearch: React.Dispatch<React.SetStateAction<number[]>>

    allSearchesPerSession: number[]
    setAllSearchesPerSession: React.Dispatch<React.SetStateAction<number[]>>

    allWeeklySessions: number[]
    setAllWeeklySessions: React.Dispatch<React.SetStateAction<number[]>>

    allWeeklyUsers: number[]
    setAllWeeklyUsers: React.Dispatch<React.SetStateAction<number[]>>
}) => {

    const [description, setDescription] = useState<string>("");
    const [creditsPerSearch, setCreditsPerSearch] = useState<number>(0);
    const [searchesPerSession, setSearchesPerSession] = useState<number>(0);
    const [weeklySessions, setWeeklySessions] = useState<number>(0);
    const [weeklyUsers, setWeeklyUsers] = useState<number>(0);

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
        props.setAllSearchesPerSession(updateArrayAndReturn(props.allSearchesPerSession, props.index, searchesPerSession))
    }, [searchesPerSession])
    useEffect(() => {
        if (props.loading) { return }
        props.setAllWeeklySessions(updateArrayAndReturn(props.allWeeklySessions, props.index, weeklySessions))
    }, [weeklySessions])
    useEffect(() => {
        if (props.loading) { return }
        props.setAllWeeklyUsers(updateArrayAndReturn(props.allWeeklyUsers, props.index, weeklyUsers))
    }, [weeklyUsers])

    useEffect(() => {
        setDescription(props.allDescription[props.index])
        setCreditsPerSearch(props.allCreditsPerSearch[props.index])
        setSearchesPerSession(props.allSearchesPerSession[props.index])
        setWeeklySessions(props.allWeeklySessions[props.index])
        setWeeklyUsers(props.allWeeklyUsers[props.index])
    }, [props.loading])

    return (
        <div className="grid grid-cols-6 gap-4 py-2">
            <Input type="text" label="Description" value={description} onValueChange={setDescription} />
            <InputNumber label={"Est. Credits per Search"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={creditsPerSearch} setValue={setCreditsPerSearch} />
            <InputNumber label={"Searches per Session"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={searchesPerSession} setValue={setSearchesPerSession} />
            <InputNumber label={"Sessions per Week"} defaultValue={0} minValue={0} maxValue={365} step={1} value={weeklySessions} setValue={setWeeklySessions} />
            <InputNumber label={"Active Weekly Users"} defaultValue={0} minValue={0} maxValue={365} step={1} value={weeklyUsers} setValue={setWeeklyUsers} />
            <div>
                <h5 className="text-sm py-4">Annual Credits: {(creditsPerSearch * searchesPerSession * weeklySessions * weeklyUsers * 52).toLocaleString()}</h5>
            </div>
        </div>
    )
}