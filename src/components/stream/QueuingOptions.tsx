'use client'
import { Input } from "@nextui-org/input";
import { Slider } from "@nextui-org/slider";
import { Switch } from "@nextui-org/switch";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

type QueuingProps = {
    enableSPq: boolean
    setEnableSPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationSPq: number
    setDurationSPq: React.Dispatch<React.SetStateAction<number>>;
    percentQueueSPq: number
    setPercentQueueSPq: React.Dispatch<React.SetStateAction<number>>;
    enableSPqCompression: boolean
    setEnableSPqCompression: React.Dispatch<React.SetStateAction<boolean>>;

    enableDPq: boolean
    setEnableDPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationDPq: number
    setDurationDPq: React.Dispatch<React.SetStateAction<number>>;
    percentQueueDPq: number
    setPercentQueueDPq: React.Dispatch<React.SetStateAction<number>>;
    enableDPqCompression: boolean
    setEnableDPqCompression: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QueuingOptions: React.FC<QueuingProps> = (props: {
    enableSPq: boolean
    setEnableSPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationSPq: number
    setDurationSPq: React.Dispatch<React.SetStateAction<number>>;
    percentQueueSPq: number
    setPercentQueueSPq: React.Dispatch<React.SetStateAction<number>>;
    enableSPqCompression: boolean
    setEnableSPqCompression: React.Dispatch<React.SetStateAction<boolean>>;

    enableDPq: boolean
    setEnableDPq: React.Dispatch<React.SetStateAction<boolean>>;
    durationDPq: number
    setDurationDPq: React.Dispatch<React.SetStateAction<number>>;
    percentQueueDPq: number
    setPercentQueueDPq: React.Dispatch<React.SetStateAction<number>>;
    enableDPqCompression: boolean
    setEnableDPqCompression: React.Dispatch<React.SetStateAction<boolean>>;

}) => {

    return (
        <>
            <div className="space-y-4">
                <Card className="" fullWidth>
                    <CardHeader className="text-medium">
                        <Switch defaultSelected color="secondary" size="sm" isSelected={props.enableSPq} onValueChange={props.setEnableSPq} /> Source Persistent Queuing
                    </CardHeader>
                    <CardBody className="px-3 py-0 text-small">
                        <div className="grid grid-cols-8 gap-4 py-4">
                            <div className="col-span-6">
                                <Slider
                                    label="Queuing Duration"
                                    color="secondary"
                                    isDisabled={!props.enableSPq}
                                    minValue={0}
                                    maxValue={24 * 7}
                                    step={props.durationSPq < 24 ? 1 : 24}
                                    onChange={(e) => props.setDurationSPq(Number(e))}
                                    value={props.durationSPq}
                                    getValue={(hours) => Number(hours) < 24 ? `${hours} hours` : `${Number(hours) / 24} days`}
                                />
                            </div>
                            <div className="col-span-1 py-2">
                                <Input
                                    type="number"
                                    size="sm"
                                    aria-label="Inbound data volume value"
                                    value={`${props.percentQueueSPq}`}
                                    onValueChange={(e) => { props.setPercentQueueSPq(Number(e) > 100 ? 100 : Number(e)) }}
                                    label="% of data to queue"
                                    min={0}
                                    max={100}
                                    step={1}
                                    variant="faded"
                                    isDisabled={!props.enableSPq}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">%</span>
                                        </div>
                                    }
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
                    </CardBody>
                </Card>
                <Card className="" fullWidth>
                    <CardHeader className="text-medium">
                        <Switch defaultSelected color="secondary" size="sm" isSelected={props.enableDPq} onValueChange={props.setEnableDPq} /> Destination Persistent Queuing
                    </CardHeader>
                    <CardBody className="px-3 py-0 text-small">
                        <div className="grid grid-cols-8 gap-4 py-4">
                            <div className="col-span-6">
                                <Slider
                                    label="Queuing Duration"
                                    color="secondary"
                                    isDisabled={!props.enableDPq}
                                    minValue={0}
                                    maxValue={24 * 7}
                                    step={props.durationDPq < 24 ? 1 : 24}
                                    onChange={(e) => props.setDurationDPq(Number(e))}
                                    value={props.durationDPq}
                                    getValue={(hours) => Number(hours) < 24 ? `${hours} hours` : `${Number(hours) / 24} days`}
                                />
                            </div>
                            <div className="col-span-1 py-2">
                                <Input
                                    type="number"
                                    size="sm"
                                    aria-label="Inbound data volume value"
                                    value={`${props.percentQueueDPq}`}
                                    onValueChange={(e) => { props.setPercentQueueDPq(Number(e) > 100 ? 100 : Number(e)) }}
                                    label="% of data to queue"
                                    min={0}
                                    max={100}
                                    step={1}
                                    variant="faded"
                                    isDisabled={!props.enableDPq}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">%</span>
                                        </div>
                                    }
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
                    </CardBody>
                </Card>
            </div>
        </>
    )
}