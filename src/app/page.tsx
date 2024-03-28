'use client'
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";

import { CriblWorkerGroup } from "@/components/CriblWorkerGroup";
import { NavBar } from "@/components/NavBar";
import { useEffect, useState } from "react";


export default function Home() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [workerGroupConfigs, setWorkerGroupConfigs] = useState<{ name: string, value: string }[]>([]);

  return (
    <>
      <div className="bg-white">
        <NavBar />
        <div className="flex justify-end pt-4 px-4">
          <Button color="secondary" onPress={onOpen}>
            Save/Share
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Save / Share Configuration</ModalHeader>
                  <ModalBody>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                      dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                      Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                      Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                      proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
        <CriblWorkerGroup name={"default"} workerGroupConfigs={workerGroupConfigs} setStringRepr={setWorkerGroupConfigs} />
      </div >
    </>
  );
}
