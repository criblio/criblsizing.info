'use client'
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";

import { CriblWorkerGroup } from "@/components/CriblWorkerGroup";
import { NavBar } from "@/components/NavBar";
import { useEffect, useState } from "react";
import { compressToBase64, decompressFromBase64 } from 'lz-string'


export default function Home() {

  const [workerGroupConfigs, setWorkerGroupConfigs] = useState<Map<string, string>>(new Map());
  const [loadingInitialState, setLoadingInitialState] = useState<boolean>(true);

  var loadConfig = (input: string) => {
    const configs = decompressFromBase64(input);
    var newConfig = new Map<string, string>();
    JSON.parse(configs).forEach((element: Array<string>) => {
      newConfig.set(element[0], element[1])
    });
    setWorkerGroupConfigs(newConfig)
  }

  var saveConfig = () => {
    const compresssedString = compressToBase64(JSON.stringify(Array.from(workerGroupConfigs)))
    return compresssedString
  }

  useEffect(() => {
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search)
      const newConfig = searchParams.get("config");
      if (newConfig) {
        loadConfig(newConfig)
      }
    }
    setLoadingInitialState(false)
  }, [])

  useEffect(() => {
    if (!loadingInitialState && 'URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search)
      searchParams.set("config", saveConfig());
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.replaceState(null, '', newRelativePathQuery);
    }
  }, [workerGroupConfigs])

  return (
    <>
      <div className="bg-white">
        <NavBar activeTab="stream" />
        <CriblWorkerGroup name={"default"} workerGroupConfigs={workerGroupConfigs} setWorkerGroupConfigs={setWorkerGroupConfigs} />
      </div >
    </>
  );
}
