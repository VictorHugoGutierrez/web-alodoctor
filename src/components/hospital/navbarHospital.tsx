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
import ModeToggle from '../themeButton';
import {
  Menu,
  ClipboardList,
  Home,
  UsersRound,
  BedSingle,
  TvMinimal,
  LogOut,
  MessageCircleMore,
  Cross,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { sonnerMessage } from '@/lib/sonnerMessage';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

export default function NavbarHospital() {
  const router = useRouter();

  const handleSairButton = async () => {
    try {
      const token = document.cookie.split('authTokenHospital=')[1] || '';

      if (token) {
        const response = await api.post('/token', { token: token });

        if (response.status === 200) {
          Cookies.remove('authTokenHospital');
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
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/hospital/chamados"
              >
                <ClipboardList className="mr-2" />
                Chamados
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/hospital/pacientes"
              >
                <Cross className="mr-2" />
                Pacientes
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/hospital/leitos"
              >
                <BedSingle className="mr-2" />
                Leitos
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/hospital/usuarios"
              >
                <UsersRound className="mr-2" />
                Usuários
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/hospital/feedback"
              >
                <MessageCircleMore className="mr-2" />
                Satisfação
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/hospital/painel"
              >
                <TvMinimal className="mr-2" />
                Painel
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
            <NavigationMenuItem className="text-xl font-bold mx-4 flex items-center">
              <Avatar className="w-20 h-10 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
              <Link href="/hospital" legacyBehavior passHref>
                Alô Doctor
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Sheet>
                <SheetTrigger>
                  <Menu />
                </SheetTrigger>
                <SheetContent>
                  <SheetTitle>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/hospital"
                    >
                      <Home className="mr-2" />
                      Home
                    </NavigationMenuLink>
                  </SheetTitle>
                  <SheetTitle className="flex">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/hospital/chamados"
                    >
                      <ClipboardList className="mr-2" />
                      Chamados
                    </NavigationMenuLink>
                  </SheetTitle>
                  <SheetTitle>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/hospital/pacientes"
                    >
                      <Cross className="mr-2" />
                      Pacientes
                    </NavigationMenuLink>
                  </SheetTitle>
                  <SheetTitle>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/hospital/leitos"
                    >
                      <BedSingle className="mr-2" />
                      Leitos
                    </NavigationMenuLink>
                  </SheetTitle>
                  <SheetTitle>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/hospital/usuarios"
                    >
                      <UsersRound className="mr-2" />
                      Usuários
                    </NavigationMenuLink>
                  </SheetTitle>
                  <SheetTitle>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/hospital/painel"
                    >
                      <TvMinimal className="mr-2" />
                      Painel
                    </NavigationMenuLink>
                  </SheetTitle>
                  <SheetTitle>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/hospital/feedback"
                    >
                      <MessageCircleMore className="mr-2" />
                      Satisfação
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
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}
