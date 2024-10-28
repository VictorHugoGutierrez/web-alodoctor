'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Perfil from '@/components/paciente/perfilPacientes';
import ModeToggle from '../themeButton';
import { Menu, Home, UserPen, ClipboardList, LogOut } from 'lucide-react';
import Chamados from '@/components/paciente/chamados';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { sonnerMessage } from '@/lib/sonnerMessage';
import Cookies from 'js-cookie';

export default function NavbarPacientes() {
  const router = useRouter();

  const handleSairButton = async () => {
    try {
      const token = document.cookie.split('authTokenPaciente=')[1] || '';

      if (token) {
        const response = await api.post('/token', { token: token });

        if (response.status === 200) {
          Cookies.remove('authTokenPaciente');
          router.push('/');
        }
      }
    } catch (error) {
      sonnerMessage(
        'Erro',
        'Não foi possível sair da sua seção. Tente novamente mais tarde.',
        'error'
      );
    }
  };

  return (
    <>
      <div className="hidden lg:flex items-center justify-between">
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
                <ClipboardList className="mr-2" />
                <Chamados />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <UserPen className="mr-2" />
                <Perfil />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu className="mr-5 mt-5 w-screen">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={handleSairButton}
              >
                <LogOut className="mr-2" />
                Sair
              </NavigationMenuLink>
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
                Alô Doctor
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
                          <Home className="mr-2" />
                          Home
                        </NavigationMenuLink>
                      </Link>
                    </SheetTitle>
                    <SheetTitle>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <ClipboardList className="mr-2" />
                        <Chamados />
                      </NavigationMenuLink>
                    </SheetTitle>
                    <SheetTitle>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <UserPen className="mr-2" />
                        <Perfil />
                      </NavigationMenuLink>
                    </SheetTitle>
                    <SheetTitle>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        onClick={handleSairButton}
                      >
                        <LogOut className="mr-2" />
                        Sair
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
