'use client'
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { InputSliderTextBox } from "@/components/InputSliderTextBox"
import { NavBar } from "@/components/NavBar"
import { Suspense, useEffect, useState } from "react"
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell, getKeyValue
} from "@nextui-org/table";
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";

interface MonthlyCalculation {
    month: number; storage_gb: number; storage_gb_formatted: string; credits: number; credits_formatted: string; cumulative_credits: number; cumulative_credits_formatted: string;
}

interface YearlyCalculation {
    year: number; credits: number; credits_formatted: string; cumulative_credits: number; cumulative_credits_formatted: string;
}

type CriblLakeCalculationProps = {

}

export const CriblLakeCalculation: React.FC<CriblLakeCalculationProps> = (props: {

}) => {

    const [dailyIngestion, setDailyIngestion] = useQueryState("lake-daily_ingestion", parseAsInteger.withDefault(500));
    const [compressionRatio, setCompressionRatio] = useQueryState("lake-compression_ratio", parseAsInteger.withDefault(15));
    const [retentionPeriod, setRetentionPeriod] = useQueryState("lake-retention_period_mo", parseAsInteger.withDefault(12));
    const [forecastDuration, setForecastDuration] = useQueryState("lake-forecast_duration_yr", parseAsInteger.withDefault(3));

    const [includeRamp, setIncludeRamp] = useQueryState("lake-include_ramp", parseAsBoolean.withDefault(true));

    const [bringOwnStorage, setBringOwnStorage] = useQueryState("lake-bring_own_storage", parseAsBoolean.withDefault(false));

    const pricePerGbMonth = bringOwnStorage ? 0.02 : 0.05;

    const [calculationRows, setCalculationRows] = useState<MonthlyCalculation[]>([]);
    const [calculationSummaryRows, setCalculationSummaryRows] = useState<YearlyCalculation[]>([]);

    const calculationSummaryColumns = [
        {
            key: "year",
            label: "YEAR"
        },
        {
            key: "credits_formatted",
            label: "CREDITS"
        },
        {
            key: "cumulative_credits_formatted",
            label: "CUMULATIVE CREDITS"
        }
    ]

    const calculationDetailColumns = [
        {
            key: "month",
            label: "MONTH",
        },
        {
            key: "storage_gb_formatted",
            label: "STORAGE (GB)",
        },
        {
            key: "credits_formatted",
            label: "CREDITS",
        },
        {
            key: "cumulative_credits_formatted",
            label: "CUMULATIVE CREDITS"
        }
    ];

    useEffect(() => {
        function calculateDetailedUtilization(dailyIngestion: number, compressionRatio: number, retentionPeriod: number, forecastDuration: number) {
            var rows: MonthlyCalculation[] = [];
            var totalCumulativeCredits: number = 0;
            for (let i = 0; i < (forecastDuration * 12); i++) {
                var storage_gb = (i === 0 ? dailyIngestion * (365 / 12) * (1 / compressionRatio) : rows[i - 1].storage_gb + (dailyIngestion * (365 / 12) * (1 / compressionRatio)));

                if (i >= retentionPeriod) {
                    totalCumulativeCredits += rows[i - 1].credits;

                    rows.push({
                        month: i + 1,
                        storage_gb: rows[i - 1].storage_gb,
                        storage_gb_formatted: rows[i - 1].storage_gb_formatted,
                        credits: rows[i - 1].credits,
                        credits_formatted: rows[i - 1].credits_formatted,
                        cumulative_credits: totalCumulativeCredits,
                        cumulative_credits_formatted: totalCumulativeCredits.toLocaleString()
                    })
                } else {
                    totalCumulativeCredits += Math.round(storage_gb * pricePerGbMonth);

                    rows.push({
                        month: i + 1,
                        storage_gb: Math.round(storage_gb),
                        storage_gb_formatted: Math.round(storage_gb).toLocaleString(),
                        credits: Math.round(storage_gb * pricePerGbMonth),
                        credits_formatted: Math.round(storage_gb * pricePerGbMonth).toLocaleString(),
                        cumulative_credits: totalCumulativeCredits,
                        cumulative_credits_formatted: totalCumulativeCredits.toLocaleString()
                    })
                }
            }

            return rows;
        }

        setCalculationRows(calculateDetailedUtilization(dailyIngestion, compressionRatio, retentionPeriod, forecastDuration))
    }, [dailyIngestion, compressionRatio, retentionPeriod, forecastDuration, pricePerGbMonth])

    useEffect(() => {
        function calculateSummary(monthlyCalculations: MonthlyCalculation[]) {
            var rows: YearlyCalculation[] = [];
            var totalCumulativeCredits: number = 0;

            for (let year = 0; year < forecastDuration; year++) {
                var cumulativeCredits = 0;
                for (let monthItem = (year * 12); monthItem < ((year + 1) * 12); monthItem++) {
                    cumulativeCredits += monthlyCalculations[monthItem].credits;
                }

                totalCumulativeCredits += cumulativeCredits;

                rows.push({
                    year: year + 1,
                    credits: cumulativeCredits,
                    credits_formatted: cumulativeCredits.toLocaleString(),
                    cumulative_credits: totalCumulativeCredits,
                    cumulative_credits_formatted: totalCumulativeCredits.toLocaleString()
                })
            }

            return rows;
        }

        if (calculationRows.length > 0 && calculationRows.length === (forecastDuration * 12)) {
            setCalculationSummaryRows(calculateSummary(calculationRows))
        }
    }, [forecastDuration, calculationRows])


    return (
        <>
            <div className="m-4">
                <div className="grid grid-cols-4 gap-4 py-4">
                    <div className="col-span-1">
                        <InputSliderTextBox label="Daily Ingestion" tooltipText="GB/day" minValue={0} maxValue={2500} step={100} value={dailyIngestion} setValue={setDailyIngestion} />
                    </div>
                    <div className="col-span-1">
                        <InputSliderTextBox label="Compression Ratio" tooltipText=":1" minValue={1} maxValue={25} step={1} value={compressionRatio} setValue={setCompressionRatio} />
                    </div>
                    <div className="col-span-1">
                        <InputSliderTextBox label="Retention Period (Months)" tooltipText="month(s)" minValue={0} maxValue={72} step={1} value={retentionPeriod} setValue={setRetentionPeriod} />
                    </div>
                    <div className="col-span-1">
                        <InputSliderTextBox label="Forecast Duration" tooltipText="year(s)" minValue={0} maxValue={16} step={1} value={forecastDuration} setValue={setForecastDuration} />
                    </div>
                </div>
            </div>
            <div className="m-4">
                <Table aria-label="Example table with dynamic content">
                    <TableHeader columns={calculationSummaryColumns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={calculationSummaryRows}>
                        {(item) => (
                            <TableRow key={item.year}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="p-4">
                <Accordion variant="splitted">
                    <AccordionItem key="1" aria-label="Detailed Calculation Information" title="Detailed Calculation Information">
                        <div className="m-4">
                            <Table aria-label="Detailed Calculation Information">
                                <TableHeader columns={calculationDetailColumns}>
                                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody items={calculationRows}>
                                    {(item) => (
                                        <TableRow key={item.month}>
                                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    )
}