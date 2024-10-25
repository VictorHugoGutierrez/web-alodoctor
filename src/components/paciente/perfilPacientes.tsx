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
  id: string;
  nome: string;
  Leito: { numero: string };
  email: string;
  dataNascimento: string; // Mantenha este tipo como string
}

export default function Perfil() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.split('authTokenPaciente=')[1] || '';
        if (token) {
          const response = await api.post('/token/paciente', { token });
          const { paciente } = response.data;
          setPaciente(paciente);
        }
      } catch (error) {
        console.error('Erro ao verificar o estado do leito:', error);
      }
    };

    fetchData();
  }, []);

  const handleSalvar = async () => {
    if (!paciente) return;

    setLoading(true);
    setError('');
    try {
      const payload = {
        email: paciente.email,
        nome: paciente.nome,
        dataNascimento: paciente.dataNascimento,
        senha: novaSenha || undefined,
      };
      console.log(payload);
      const response = await api.put(`/pacientes/${paciente.id}`, payload);
      console.log('Paciente atualizado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao salvar o paciente: ', error);
      setError('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (!paciente || !paciente.Leito) return <div>Carregando...</div>;

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
              onChange={(e) =>
                setPaciente({ ...paciente, nome: e.target.value })
              }
              className="col-span-3"
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
              onChange={(e) =>
                setPaciente({ ...paciente, email: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={
                paciente?.dataNascimento
                  ? new Date(paciente.dataNascimento)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) =>
                setPaciente({ ...paciente, dataNascimento: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="novaSenha">Nova Senha</Label>
            <Input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <DialogFooter>
          <Button onClick={handleSalvar} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
