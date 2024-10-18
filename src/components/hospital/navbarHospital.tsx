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
import ModeToggle from "../themeButton";
import { Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export default function NavbarHospital() {
  return (
    <>
      <div className="hidden lg:block">
        <NavigationMenu className="ml-5 mt-5 w-screen">
          <NavigationMenuList>
            <NavigationMenuItem className="text-xl font-bold flex items-center">
              <Avatar className="w-20 h-10 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
              <Link href="/hospital" legacyBehavior passHref>
                Alô Doctor
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link href="/hospital/chamados" legacyBehavior passHref>
                  Chamados
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link href="/hospital/pacientes" legacyBehavior passHref>
                  Pacientes
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link href="/hospital/leitos" legacyBehavior passHref>
                  Leitos
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link href="/hospital/painel" legacyBehavior passHref>
                  Painel
                </Link>
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
            <NavigationMenuItem className="text-xl font-bold mx-4 flex items-center">
              <Avatar className="w-20 h-10 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
              <Link href="/hospital" legacyBehavior passHref>
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
                      <Link href="/hospital" legacyBehavior passHref>
                        Home
                      </Link>
                    </SheetTitle>
                    <SheetTitle>
                      <Link href="/hospital/chamados" legacyBehavior passHref>
                        Chamados
                      </Link>
                    </SheetTitle>
                    <SheetTitle>
                      <Link href="/hospital/pacientes" legacyBehavior passHref>
                        Pacientes
                      </Link>
                    </SheetTitle>
                    <SheetTitle>
                      <Link href="/hospital/leitos" legacyBehavior passHref>
                        Leitos
                      </Link>
                    </SheetTitle>
                    <SheetTitle>
                      <Link href="/hospital/painel" legacyBehavior passHref>
                        Painel
                      </Link>
                    </SheetTitle>
                    <SheetTitle className="my-2">
                      <ModeToggle />
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
