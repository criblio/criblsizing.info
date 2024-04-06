import { CriblSearchAdhocCreditCalculation } from "@/components/CriblSearchAdhocCreditCalculation";
import { CriblSearchScheduledCreditCalculation } from "@/components/CriblSearchScheduledCreditCalculation";
import { NavBar } from "@/components/NavBar";

export default function Page() {
    return (
        <>
            <div className="bg-white">
                <NavBar activeTab="search" />
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <h2>Scheduled Aggregations</h2>
                        <CriblSearchScheduledCreditCalculation />
                        <CriblSearchScheduledCreditCalculation />
                        <CriblSearchScheduledCreditCalculation />
                    </div>
                </div>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <h2>Other Scheduled Searches</h2>
                        <CriblSearchScheduledCreditCalculation />
                        <CriblSearchScheduledCreditCalculation />
                    </div>
                </div>
                <div className="bg-gray-50 m-4 p-4 border rounded-md">
                    <div className="text-2xl mb-4">
                        <h2>Ad-Hoc Searching</h2>
                        <CriblSearchAdhocCreditCalculation />
                        <CriblSearchAdhocCreditCalculation />
                        <CriblSearchAdhocCreditCalculation />
                    </div>
                </div>
            </div>
        </>
    )
}