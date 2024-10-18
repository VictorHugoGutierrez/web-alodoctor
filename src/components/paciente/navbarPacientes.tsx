"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Perfil from "@/components/paciente/perfilPacientes";
import ModeToggle from "../themeButton";
import { Menu } from "lucide-react";
import Chamados from "@/components/paciente/chamados";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function NavbarPacientes() {
  return (
    <>
      <div className="hidden lg:block">
        <NavigationMenu className="ml-5 mt-5 w-screen">
          <NavigationMenuList>
            <NavigationMenuItem className="text-xl font-bold items-center flex">
              <Avatar className="w-20 h-10 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
              <Link href="/pacientes" legacyBehavior passHref>
                Alô Doctor
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Chamados />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Perfil />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="block lg:hidden">
        <NavigationMenu className="mt-5">
          <NavigationMenuList className="justify-between w-screen">
            <NavigationMenuItem className="text-xl font-bold mx-4 items-center flex">
              <Avatar className="w-20 h-10 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
              <Link href="/pacientes" legacyBehavior passHref>
                AloDoctor
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Sheet>
                  <SheetTrigger>
                    <Menu />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetTitle>
                      <Link href="/pacientes" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Home
                        </NavigationMenuLink>
                      </Link>
                    </SheetTitle>
                    <SheetTitle>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <Chamados />
                      </NavigationMenuLink>
                    </SheetTitle>
                    <SheetTitle>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <Perfil />
                      </NavigationMenuLink>
                    </SheetTitle>
                    <SheetTitle className="my-2">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <ModeToggle />
                      </NavigationMenuLink>
                    </SheetTitle>
                  </SheetContent>
                </Sheet>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}
