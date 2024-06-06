'use client'
import { NavBar } from "@/components/NavBar"
import { CriblLakeCalculation } from "@/components/lake/LakeCalculation"
import { Suspense } from "react"

export default function Home() {
    return (
        <>
            <div className="bg-white">
                <Suspense>
                    <NavBar activeTab="lake" />
                </Suspense>
                <Suspense>
                    <CriblLakeCalculation />
                </Suspense>
            </div>
        </>
    )
}