'use client'

import { NavBar } from "@/components/NavBar"
import { Suspense, useState } from "react"
import { Tabs, Tab } from "@nextui-org/tabs";
import { CriblLakeCalculation } from "@/components/lake/LakeCalculation";
import { CriblWorkerGroup } from "@/components/stream/CriblWorkerGroup";
import { Image } from "@nextui-org/image";

export default function Home() {

    const [selectedTab, setSelectedTab] = useState<React.Key>("");

    return (
        <>
            <div className="bg-white">
                <Suspense>
                    <NavBar />
                </Suspense>
                <div className="flex w-full flex-col m-4">
                    <Tabs aria-label="product" color="secondary" onSelectionChange={(newTab) => {setSelectedTab(newTab)}} >
                        <Tab key="stream" title={
                            <div className="flex items-center space-x-1">
                                <Image width={"35"} src={`Cribl-Stream-Mark-1C-${selectedTab.toString() === "stream" ? "White" : "Teal"}.png`} />
                                <span>Stream</span>
                            </div>
                        }>
                            <CriblWorkerGroup name={"default"} />
                        </Tab>
                        <Tab key="lake" title={
                            <div className="flex items-center space-x-1">
                                <Image width={"35"} src={`Cribl-Lake-Mark-1C-${selectedTab.toString() === "lake" ? "White" : "Teal"}.png`} />
                                <span>Lake</span>
                            </div>
                        }>
                            <CriblLakeCalculation />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
}