'use client'
import { Button } from "@nextui-org/button";
import Image from 'next/image';
import { Link } from "@nextui-org/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";

import criblLogo from "../../public/Cribl-Logo-2C-White.svg"


type NavBarProps = {
}

export const NavBar: React.FC<NavBarProps> = (props: {
}) => {

    return (
        <Navbar position="static" isBordered shouldHideOnScroll className="bg-[#020E1B]">
            <NavbarBrand>
                <Image src={criblLogo} alt="cribl logo" height={64} />
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Button as={Link} color="secondary" href="https://docs.cribl.io/stream/deploy-reference/#reference-architectures" target="_blank" variant="solid" radius="full" className="text-black font-medium" >
                        Reference Architectures
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="secondary" href="https://docs.cribl.io" target="_blank" variant="bordered" radius="full" className="text-white border-white font-medium">
                        Documentation
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}