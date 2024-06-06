'use client'

import { NavBar } from "@/components/NavBar"
import { Suspense } from "react"


export default function Home() {
    return (
        <>
            <div className="bg-white">
                <Suspense>
                    <NavBar activeTab="leader" />
                </Suspense>
            </div>
        </>
    )
}