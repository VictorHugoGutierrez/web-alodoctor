'use client';

import { useState } from 'react';
import ModeToggle from '@/components/themeButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { api } from '../lib/axios';
import Cookies from 'js-cookie';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [hospitalPassword, setHospitalPassword] = useState('');
  const router = useRouter();

  const handleSubmitPaciente = async () => {
    const response = await api.post('/pacientes/login', {
      email: email,
      senha: password,
    });

    Cookies.set('authTokenPaciente', response.data.token, { expires: 30 });

    router.push('/pacientes');
  };

  const handleSubmitHospital = async () => {
    const response = await api.post('/usuarios/login', {
      username: username,
      password: hospitalPassword,
    });

    Cookies.set('authTokenHospital', response.data.token, { expires: 30 });

    router.push('/hospital');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Tabs defaultValue="paciente" className="w-[500px] m-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paciente">Paciente</TabsTrigger>
          <TabsTrigger value="hospital">Hospital</TabsTrigger>
        </TabsList>
        <TabsContent value="paciente">
          <Card>
            <div className="flex items-center">
              <CardHeader>
                <CardTitle>Bem vindo ao Alô Doctor!</CardTitle>
                <CardDescription>
                  Se você for paciente entre por aqui.
                </CardDescription>
              </CardHeader>
              <Avatar className="w-40 h-20 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmitPaciente}>Entrar</Button>
              <ModeToggle />
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="hospital">
          <Card>
            <div className="flex items-center">
              <CardHeader>
                <CardTitle>Hospital</CardTitle>
                <CardDescription>
                  Digite as informações corretamente.
                </CardDescription>
              </CardHeader>
              <Avatar className="w-40 h-20 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="user">Usuário</Label>
                <Input
                  id="user"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hospital-password">Senha</Label>
                <Input
                  id="hospital-password"
                  type="password"
                  value={hospitalPassword}
                  onChange={(e) => setHospitalPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleSubmitHospital}>Entrar</Button>
              <ModeToggle />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
