'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ModeToggle from '../themeButton';
import { Menu } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

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
                <a>Alô Doctor</a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/hospital/chamados" legacyBehavior passHref>
                <a className={navigationMenuTriggerStyle()}>Chamados</a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/hospital/pacientes" legacyBehavior passHref>
                <a className={navigationMenuTriggerStyle()}>Pacientes</a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/hospital/leitos" legacyBehavior passHref>
                <a className={navigationMenuTriggerStyle()}>Leitos</a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/hospital/painel" legacyBehavior passHref>
                <a className={navigationMenuTriggerStyle()}>Painel</a>
              </Link>
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
                <a>AloDoctor</a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Sheet>
                <SheetTrigger>
                  <Menu />
                </SheetTrigger>
                <SheetContent>
                  <SheetTitle>
                    <Link href="/hospital" legacyBehavior passHref>
                      <a>Home</a>
                    </Link>
                  </SheetTitle>
                  <SheetTitle>
                    <Link href="/hospital/chamados" legacyBehavior passHref>
                      <a>Chamados</a>
                    </Link>
                  </SheetTitle>
                  <SheetTitle>
                    <Link href="/hospital/pacientes" legacyBehavior passHref>
                      <a>Pacientes</a>
                    </Link>
                  </SheetTitle>
                  <SheetTitle>
                    <Link href="/hospital/leitos" legacyBehavior passHref>
                      <a>Leitos</a>
                    </Link>
                  </SheetTitle>
                  <SheetTitle>
                    <Link href="/hospital/painel" legacyBehavior passHref>
                      <a>Painel</a>
                    </Link>
                  </SheetTitle>
                  <SheetTitle className="my-2">
                    <ModeToggle />
                  </SheetTitle>
                </SheetContent>
              </Sheet>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}
