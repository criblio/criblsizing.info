'use client'
import { CriblSearchAdhocCreditCalculation } from "@/components/CriblSearchAdhocCreditCalculation";
import { CriblSearchScheduledCreditCalculation } from "@/components/CriblSearchScheduledCreditCalculation";
import { NavBar } from "@/components/NavBar";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/react";
import { MouseEventHandler, Suspense, useEffect, useState } from "react";
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { SearchConfig, serializeSearchConfig } from "@/utils/serializeSearchConfig";
import { updateArrayAndReturn } from "@/utils/arrays";

export default function Page() {

    const [scheduledAggregationCount, setScheduledAggregationCount] = useState<number>(0);
    const [scheduledSearchesCount, setScheduledSearchesCount] = useState<number>(0);
    const [adhocSearchesCount, setAdhocSearchesCount] = useState<number>(0);

    const [allScheduledAggregationDescription, setAllScheduledAggregationDescription] = useState<string[]>([""]);
    const [allScheduledAggregationCreditsPerSearch, setAllScheduledAggregationCreditsPerSearch] = useState<number[]>([0]);
    const [allScheduledAggregationDailySearches, setAllScheduledAggregationDailySearches] = useState<number[]>([0]);
    const [allScheduledAggregationDaysScheduled, setAllScheduledAggregationDaysScheduled] = useState<number[]>([0]);

    const [allScheduledSearchesDescription, setAllScheduledSearchesDescription] = useState<string[]>([""]);
    const [allScheduledSearchesCreditsPerSearch, setAllScheduledSearchesCreditsPerSearch] = useState<number[]>([0]);
    const [allScheduledSearchesDailySearches, setAllScheduledSearchesDailySearches] = useState<number[]>([0]);
    const [allScheduledSearchesDaysScheduled, setAllScheduledSearchesDaysScheduled] = useState<number[]>([0]);

    const [allAdhocSearchesDescription, setAllAdhocSearchesDescription] = useState<string[]>([""]);
    const [allAdhocSearchesCreditsPerSearch, setAllAdhocSearchesCreditsPerSearch] = useState<number[]>([0]);
    const [allAdhocSearchesPerSession, setAllAdhocSearchesPerSession] = useState<number[]>([0]);
    const [allAdhocSearchesWeeklySessions, setAllAdhocSearchesWeeklySessions] = useState<number[]>([0]);
    const [allAdhocSearchesWeeklyUsers, setAllAdhocSearchesWeeklyUsers] = useState<number[]>([0]);

    const [loadingInitialState, setLoadingInitialState] = useState<boolean>(true);

    var loadConfig = (input: string) => {
        const config: SearchConfig = JSON.parse(decompressFromBase64(input));
        if (config) {
            setAllScheduledAggregationDescription(structuredClone(config.scheduledAggregations.descriptions))
            setAllScheduledAggregationCreditsPerSearch(config.scheduledAggregations.creditsPerSearch)
            setAllScheduledAggregationDailySearches(config.scheduledAggregations.dailySearches)
            setAllScheduledAggregationDaysScheduled(config.scheduledAggregations.daysScheduled)

            setAllScheduledSearchesDescription(config.scheduledSearches.descriptions)
            setAllScheduledSearchesCreditsPerSearch(config.scheduledSearches.creditsPerSearch)
            setAllScheduledSearchesDailySearches(config.scheduledSearches.dailySearches)
            setAllScheduledSearchesDaysScheduled(config.scheduledSearches.daysScheduled)

            setAllAdhocSearchesDescription(config.adhocSearches.descriptions)
            setAllAdhocSearchesCreditsPerSearch(config.adhocSearches.creditsPerSearch)
            setAllAdhocSearchesPerSession(config.adhocSearches.searchesPerSession)
            setAllAdhocSearchesWeeklySessions(config.adhocSearches.weeklySessions)
            setAllAdhocSearchesWeeklyUsers(config.adhocSearches.weeklyUsers)

            setScheduledAggregationCount(config.scheduledAggregations.descriptions.length)
            setScheduledSearchesCount(config.scheduledSearches.descriptions.length)
            setAdhocSearchesCount(config.adhocSearches.descriptions.length)
        }
    }

    var saveConfig = () => {
        const serializedConfig = serializeSearchConfig(
            allScheduledAggregationDescription,
            allScheduledAggregationCreditsPerSearch,
            allScheduledAggregationDailySearches,
            allScheduledAggregationDaysScheduled,

            allScheduledSearchesDescription,
            allScheduledSearchesCreditsPerSearch,
            allScheduledSearchesDailySearches,
            allScheduledSearchesDaysScheduled,

            allAdhocSearchesDescription,
            allAdhocSearchesCreditsPerSearch,
            allAdhocSearchesPerSession,
            allAdhocSearchesWeeklySessions,
            allAdhocSearchesWeeklyUsers
        )

        const compresssedString = compressToBase64(serializedConfig)
        return compresssedString
    }

    useEffect(() => {
        if (loadingInitialState && 'URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search)
            const newConfig = searchParams.get("searchConfig");
            if (newConfig) {
                loadConfig(newConfig)
            }
        }
        setLoadingInitialState(false)
    }, [])

    useEffect(() => {
        if (!loadingInitialState && 'URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search)
            searchParams.set("searchConfig", saveConfig());
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.replaceState(null, '', newRelativePathQuery);
        }
    }, [scheduledAggregationCount, scheduledSearchesCount, adhocSearchesCount,
        allScheduledAggregationDescription, allScheduledAggregationCreditsPerSearch,
        allScheduledAggregationDailySearches, allScheduledAggregationDaysScheduled,

        allScheduledSearchesDescription, allScheduledSearchesCreditsPerSearch,
        allScheduledSearchesDailySearches, allScheduledSearchesDaysScheduled,

        allAdhocSearchesDescription, allAdhocSearchesCreditsPerSearch,
        allAdhocSearchesPerSession, allAdhocSearchesWeeklySessions,
        allAdhocSearchesWeeklyUsers])


    const scheduledAggregationsRows = [];
    for (let i = 0; i < scheduledAggregationCount; i++) {
        scheduledAggregationsRows.push(
            <CriblSearchScheduledCreditCalculation key={i} index={i} loading={loadingInitialState}
                allDescription={allScheduledAggregationDescription} setAllDescription={setAllScheduledAggregationDescription}
                allCreditsPerSearch={allScheduledAggregationCreditsPerSearch} setAllCreditsPerSearch={setAllScheduledAggregationCreditsPerSearch}
                allDailySearches={allScheduledAggregationDailySearches} setAllDailySearches={setAllScheduledAggregationDailySearches}
                allDaysScheduled={allScheduledAggregationDaysScheduled} setAllDaysScheduled={setAllScheduledAggregationDaysScheduled}
            />
        )
    }

    const scheduledSearchesRows = [];
    for (let i = 0; i < scheduledSearchesCount; i++) {
        scheduledSearchesRows.push(
            <CriblSearchScheduledCreditCalculation key={i} index={i} loading={loadingInitialState}
                allDescription={allScheduledSearchesDescription} setAllDescription={setAllScheduledSearchesDescription}
                allCreditsPerSearch={allScheduledSearchesCreditsPerSearch} setAllCreditsPerSearch={setAllScheduledSearchesCreditsPerSearch}
                allDailySearches={allScheduledSearchesDailySearches} setAllDailySearches={setAllScheduledSearchesDailySearches}
                allDaysScheduled={allScheduledSearchesDaysScheduled} setAllDaysScheduled={setAllScheduledSearchesDaysScheduled}
            />
        )
    }

    const adhocSearchingRows = [];
    for (let i = 0; i < adhocSearchesCount; i++) {
        adhocSearchingRows.push(
            <CriblSearchAdhocCreditCalculation key={i} index={i} loading={loadingInitialState}
                allDescription={allAdhocSearchesDescription} setAllDescription={setAllAdhocSearchesDescription}
                allCreditsPerSearch={allAdhocSearchesCreditsPerSearch} setAllCreditsPerSearch={setAllAdhocSearchesCreditsPerSearch}
                allSearchesPerSession={allAdhocSearchesPerSession} setAllSearchesPerSession={setAllAdhocSearchesPerSession}
                allWeeklySessions={allAdhocSearchesWeeklySessions} setAllWeeklySessions={setAllAdhocSearchesWeeklySessions}
                allWeeklyUsers={allAdhocSearchesWeeklyUsers} setAllWeeklyUsers={setAllAdhocSearchesWeeklyUsers}
            />
        )
    }

    function calculateTotalScheduledCredits(count: number, perSearch: number[], daily: number[], days: number[]) {
        var runningTotal = 0;
        for (let i = 0; i < count; i++) {
            runningTotal += (perSearch[i] * daily[i] * days[i]) || 0
        }

        return runningTotal
    }

    function calculateTotalAdhocCredits(count: number, perSearch: number[], perSession: number[], weeklySessions: number[], weeklyUsers: number[]) {
        var runningTotal = 0;
        for (let i = 0; i < count; i++) {
            runningTotal += (perSearch[i] * perSession[i] * weeklySessions[i] * weeklyUsers[i])
        }

        return runningTotal
    }

    const handleAddScheduledAggregationClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setAllScheduledAggregationDescription([...allScheduledAggregationDescription, ""]);
        setAllScheduledAggregationCreditsPerSearch([...allScheduledAggregationCreditsPerSearch, 0]);
        setAllScheduledAggregationDailySearches([...allScheduledAggregationDailySearches, 0]);
        setAllScheduledAggregationDaysScheduled([...allScheduledAggregationDaysScheduled, 0]);

        setScheduledAggregationCount(scheduledAggregationCount + 1);
    }

    const handleAddScheduledSearchClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setAllScheduledSearchesDescription([...allScheduledSearchesDescription, ""]);
        setAllScheduledSearchesCreditsPerSearch([...allScheduledSearchesCreditsPerSearch, 0]);
        setAllScheduledSearchesDailySearches([...allScheduledSearchesDailySearches, 0]);
        setAllScheduledSearchesDaysScheduled([...allScheduledSearchesDaysScheduled, 0]);

        setScheduledSearchesCount(scheduledSearchesCount + 1);
    }

    const handleAddAdhocSearchClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        setAllAdhocSearchesDescription([...allAdhocSearchesDescription, ""])
        setAllAdhocSearchesCreditsPerSearch([...allAdhocSearchesCreditsPerSearch, 0])
        setAllAdhocSearchesPerSession([...allAdhocSearchesPerSession, 0])
        setAllAdhocSearchesWeeklySessions([...allAdhocSearchesWeeklySessions, 0])
        setAllAdhocSearchesWeeklyUsers([...allAdhocSearchesWeeklyUsers, 0])

        setAdhocSearchesCount(adhocSearchesCount + 1)
    }

    return (
        <>
            <div className="bg-white">
                <Suspense>
                    <NavBar activeTab="search" />
                </Suspense>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <div className="flex justify-between">
                            <h2>Scheduled Aggregations</h2>
                            <Button onClick={handleAddScheduledAggregationClick}>Add Row</Button>
                        </div>
                        {scheduledAggregationsRows}
                    </div>
                </div>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <div className="flex justify-between">
                            <h2>Other Scheduled Searches</h2>
                            <Button onClick={handleAddScheduledSearchClick}>Add Row</Button>
                        </div>
                        {scheduledSearchesRows}
                    </div>
                </div>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <div className="flex justify-between">
                            <h2>Ad-Hoc Searching</h2>
                            <Button onClick={handleAddAdhocSearchClick}>Add Row</Button>
                        </div>
                        {adhocSearchingRows}
                    </div>
                </div>

                <div className="p-4">
                    <Table isStriped aria-label="search sizing calculations">
                        <TableHeader>
                            <TableColumn>CATEGORY</TableColumn>
                            <TableColumn>CREDITS ANNUALLY</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>Scheduled Aggregations</TableCell>
                                <TableCell>{calculateTotalScheduledCredits(scheduledAggregationCount, allScheduledAggregationCreditsPerSearch, allScheduledAggregationDailySearches, allScheduledAggregationDaysScheduled).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>Other Scheduled Searches</TableCell>
                                <TableCell>{calculateTotalScheduledCredits(scheduledSearchesCount, allScheduledSearchesCreditsPerSearch, allScheduledSearchesDailySearches, allScheduledSearchesDaysScheduled).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>Ad-Hoc Searching</TableCell>
                                <TableCell>{calculateTotalAdhocCredits(adhocSearchesCount, allAdhocSearchesCreditsPerSearch, allAdhocSearchesPerSession, allAdhocSearchesWeeklySessions, allAdhocSearchesWeeklyUsers).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell><b>TOTALS</b></TableCell>
                                <TableCell><b>{
                                    (calculateTotalScheduledCredits(scheduledAggregationCount, allScheduledAggregationCreditsPerSearch, allScheduledAggregationDailySearches, allScheduledAggregationDaysScheduled) +
                                        calculateTotalScheduledCredits(scheduledSearchesCount, allScheduledSearchesCreditsPerSearch, allScheduledSearchesDailySearches, allScheduledSearchesDaysScheduled) +
                                        calculateTotalAdhocCredits(adhocSearchesCount, allAdhocSearchesCreditsPerSearch, allAdhocSearchesPerSession, allAdhocSearchesWeeklySessions, allAdhocSearchesWeeklyUsers)).toLocaleString()
                                }</b></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}