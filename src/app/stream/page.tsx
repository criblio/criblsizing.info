'use client'
import { CriblWorkerGroup } from "@/components/stream/CriblWorkerGroup";
import { NavBar } from "@/components/NavBar";
import { Suspense, useEffect, useState } from "react";
import { compressToBase64, decompressFromBase64 } from 'lz-string'


export default function Home() {

  const [workerGroupConfigs, setWorkerGroupConfigs] = useState<Map<string, string>>(new Map());
  return (
    <>
      <div className="bg-white">
        <Suspense>
          <NavBar activeTab="stream" />
        </Suspense>
        <CriblWorkerGroup name={"default"} workerGroupConfigs={workerGroupConfigs} setWorkerGroupConfigs={setWorkerGroupConfigs} />
      </div >
    </>
  );
}
