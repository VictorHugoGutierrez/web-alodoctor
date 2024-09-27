'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';

interface Paciente {
  nome: string;
  Leito: { numero: string };
  email: string;
  dataNascimento: string;
}

export default function Perfil() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.split('authTokenPaciente=')[1] || '';
        const response = await api.post('/token/paciente', { token });
        const { paciente } = response.data;
        setPaciente(paciente);
      } catch (error) {
        console.error('Erro ao verificar o estado do leito:', error);
      }
    };

    fetchData();
  }, []);

  if (!paciente || !paciente.Leito) return <div>Perfil</div>;

  return (
    <Dialog>
      <DialogTrigger>Perfil</DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando você
            terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={paciente.nome}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leito">Leito</Label>
            <Input
              id="leito"
              value={paciente.Leito.numero}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={paciente.email}
              className="col-span-3"
              readOnly
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
