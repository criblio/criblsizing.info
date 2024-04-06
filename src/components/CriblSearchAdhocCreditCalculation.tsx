'use client'
import { Input } from "@nextui-org/input";
import { InputNumber } from "./InputNumber";
import { useState } from "react";

type CriblAdhocScheduledCreditCalculationProps = {
}

export const CriblSearchAdhocCreditCalculation: React.FC<CriblAdhocScheduledCreditCalculationProps> = (props: {
}) => {

    const [creditsPerSearch, setCreditsPerSearch] = useState<number>(0);
    const [searchesPerSession, setSearchesPerSession] = useState<number>(0);
    const [sessionWeek, setSessionsWeek] = useState<number>(0);
    const [activeUsersWeek, setActiveUsersWeek] = useState<number>(0);

    return (
        <div className="grid grid-cols-6 gap-4 py-4">
            <Input type="text" label="Description" />
            <InputNumber label={"Est. Credits per Search"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={creditsPerSearch} setValue={setCreditsPerSearch} />
            <InputNumber label={"Searches per Session"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={searchesPerSession} setValue={setSearchesPerSession} />
            <InputNumber label={"Sessions per Week"} defaultValue={0} minValue={0} maxValue={365} step={1} value={sessionWeek} setValue={setSessionsWeek} />
            <InputNumber label={"Active Weekly Users"} defaultValue={0} minValue={0} maxValue={365} step={1} value={activeUsersWeek} setValue={setActiveUsersWeek} />
            <div>
                <h5 className="text-sm py-4">Annual Credits: {creditsPerSearch * searchesPerSession * sessionWeek * activeUsersWeek}</h5>
            </div>
        </div>
    )
}