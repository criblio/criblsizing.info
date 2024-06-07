'use client'

import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";

type CriblWorkerGroupAdvOptionsProps = {
    workerRedundency: boolean
    setWorkerRedundency: React.Dispatch<React.SetStateAction<boolean>>

    tcpLoadBalancing: boolean
    setTcpLoadBalancing: React.Dispatch<React.SetStateAction<boolean>>
}

export const CriblWorkerGroupAdvOptions: React.FC<CriblWorkerGroupAdvOptionsProps> = (props: {
    workerRedundency: boolean
    setWorkerRedundency: React.Dispatch<React.SetStateAction<boolean>>

    tcpLoadBalancing: boolean
    setTcpLoadBalancing: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <CheckboxGroup
            label="Resiliency Options"
            color="secondary"
            defaultValue={["worker_redundency"]}
            value={[
                props.workerRedundency ? 'worker_redundency' : '', props.tcpLoadBalancing ? 'tcp_lb': ''
            ].filter((x) => x !== '')}
        >
            <Checkbox classNames={{ label: "text-md" }} value="worker_redundency" onValueChange={props.setWorkerRedundency}>Worker Redundency (+1)</Checkbox>
            <Checkbox classNames={{ label: "text-md" }} value="tcp_lb" onValueChange={props.setTcpLoadBalancing}>TCP Load Balancer Process</Checkbox>
        </CheckboxGroup>
    )
}