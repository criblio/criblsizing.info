'use client'
import { Input } from "@nextui-org/input";
import { InputNumber } from "./InputNumber";
import { useState } from "react";

type CriblSearchScheduledCreditCalculationProps = {
}

export const CriblSearchScheduledCreditCalculation: React.FC<CriblSearchScheduledCreditCalculationProps> = (props: {
}) => {

    const [creditsPerSearch, setCreditsPerSearch] = useState<number>(0);
    const [dailySearches, setDailySearches] = useState<number>(0);
    const [daysScheduled, setDaysScheduled] = useState<number>(0);

    return (
        <div className="grid grid-cols-5 gap-4 py-4">
            <Input type="text" label="Description" />
            <InputNumber label={"Est. Credits per Search"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={creditsPerSearch} setValue={setCreditsPerSearch} />
            <InputNumber label={"Daily Searches"} defaultValue={0} minValue={0} maxValue={1000} step={1} value={dailySearches} setValue={setDailySearches} />
            <InputNumber label={"Days Scheduled"} defaultValue={0} minValue={0} maxValue={365} step={1} value={daysScheduled} setValue={setDaysScheduled} />
            <div>
                <h5 className="text-sm py-4">Annual Credits: {creditsPerSearch * dailySearches * daysScheduled}</h5>
            </div>
        </div>
    )
}