import { Button } from "@nextui-org/button";
import Image from 'next/image';
import { Link } from "@nextui-org/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";

import criblLogo from "../../public/Cribl-Logo-2C-White.svg"
import { useState } from "react";

type ActiveTab = "stream" | "search";

type NavBarProps = {
    activeTab: ActiveTab
}

export const NavBar: React.FC<NavBarProps> = (props: {
    activeTab: ActiveTab
}) => {

    return (
        <Navbar position="static" isBordered shouldHideOnScroll className="bg-[#020E1B]">
            <NavbarBrand>
                <Image src={criblLogo} alt="cribl logo" height={64} />
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={props.activeTab === 'stream' ? true : false} className="text-secondary">
                    <Link href="/stream" aria-current="page" className={props.activeTab === 'stream' ? "text-cribl_teal" : "text-white"}>
                        Stream
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={props.activeTab === 'search' ? true : false} className="text-secondary">
                    <Link href="/search" aria-current="page" className={props.activeTab === 'search' ? "text-cribl_teal" : "text-white"}>
                        Search
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Button as={Link} color="secondary" href="#" variant="solid" radius="full" className="text-black font-medium" >
                        Reference Architectures
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="secondary" href="#" variant="bordered" radius="full" className="text-white border-white font-medium">
                        Documentation
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}