'use client'
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Slider, SliderValue } from "@nextui-org/slider";
import { Switch } from "@nextui-org/switch";
import { useState } from "react";

type QueuingAccordionProps = {
    enableSPq: boolean
    setEnableSPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationSPq: number
    setDurationSPq: React.Dispatch<React.SetStateAction<number>>;
    enableSPqCompression: boolean
    setEnableSPqCompression: React.Dispatch<React.SetStateAction<boolean>>;

    enableDPq: boolean
    setEnableDPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationDPq: number
    setDurationDPq: React.Dispatch<React.SetStateAction<number>>;
    enableDPqCompression: boolean
    setEnableDPqCompression: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QueuingAccordion: React.FC<QueuingAccordionProps> = (props: {
    enableSPq: boolean
    setEnableSPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationSPq: number
    setDurationSPq: React.Dispatch<React.SetStateAction<number>>;
    enableSPqCompression: boolean
    setEnableSPqCompression: React.Dispatch<React.SetStateAction<boolean>>;

    enableDPq: boolean
    setEnableDPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationDPq: number
    setDurationDPq: React.Dispatch<React.SetStateAction<number>>;
    enableDPqCompression: boolean
    setEnableDPqCompression: React.Dispatch<React.SetStateAction<boolean>>;

}) => {

    return (
        <>
            <Accordion variant='splitted' selectionMode="multiple" defaultSelectedKeys={"all"}>
                <AccordionItem isCompact key="source_pq" aria-label="Source Persistent Queuing" title="Source Persistent Queuing"
                    startContent={<Switch defaultSelected color="secondary" size="sm" isSelected={props.enableSPq} onValueChange={props.setEnableSPq} />}
                >
                    <div className="grid grid-cols-8 gap-4 py-4">
                        <div className="col-span-7">
                            <Slider
                                label="Queuing Duration"
                                color="secondary"
                                isDisabled={!props.enableSPq}
                                minValue={0}
                                maxValue={24 * 7}
                                step={props.durationSPq < 24 ? 1 : 24}
                                onChange={(e) => props.setDurationSPq(Number(e))}
                                getValue={(hours) => Number(hours) < 24 ? `${hours} hours` : `${Number(hours) / 24} days`}
                            />
                        </div>
                        <div className="col-span-1 pt-5">
                            <Switch
                                color="secondary"
                                isDisabled={!props.enableSPq}
                                classNames={{ label: "text-xs" }}
                                isSelected={props.enableSPqCompression}
                                onValueChange={props.setEnableSPqCompression}
                            >
                                PQ Compression
                            </Switch>
                        </div>
                    </div>
                </AccordionItem>
                <AccordionItem isCompact key="destination_pq" aria-label="Destination Persistent Queuing" title="Destination Persistent Queuing" 
                    startContent={<Switch defaultSelected color="secondary" size="sm" isSelected={props.enableDPq} onValueChange={props.setEnableDPq} />}
                >
                    <div className="grid grid-cols-8 gap-4 py-4">
                        <div className="col-span-7">
                            <Slider
                                label="Queuing Duration"
                                color="secondary"
                                isDisabled={!props.enableDPq}
                                minValue={0}
                                maxValue={24 * 7}
                                step={props.durationDPq < 24 ? 1 : 24}
                                onChange={(e) => props.setDurationDPq(Number(e))}
                                getValue={(hours) => Number(hours) < 24 ? `${hours} hours` : `${Number(hours) / 24} days`}
                            />
                        </div>
                        <div className="col-span-1 pt-5">
                            <Switch
                                color="secondary"
                                isDisabled={!props.enableDPq}
                                classNames={{ label: "text-xs" }}
                                isSelected={props.enableDPqCompression}
                                onValueChange={props.setEnableDPqCompression}
                            >
                                PQ Compression
                            </Switch>
                        </div>
                    </div>
                </AccordionItem>
            </Accordion>
        </>
    )
}